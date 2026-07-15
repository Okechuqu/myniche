
from calendar import monthrange
from datetime import timedelta

from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ContentPlan, PlannedContent
from .serializers import GeneratePlanSerializer
from .services.planner_generator import PlannerGeneratorService


def _current_week_start():
    today = timezone.localdate()
    return today - timedelta(days=today.weekday())


def _current_month_start():
    today = timezone.localdate()
    return today.replace(day=1)


def _plan_payload(plan):
    return {
        "id": plan.id,
        "title": plan.title,
        "niche": plan.niche,
        "platform": plan.platform,
        "week_start": plan.week_start,
        "created_at": plan.created_at,
        "content_plan": plan.content_plan,
        "items": [
            {
                "id": item.id,
                "day_name": item.day_name,
                "topic": item.topic,
                "status": item.status,
                "script": item.script,
                "generated_title": item.generated_title,
                "generated_variant": item.generated_variant,
            }
            for item in plan.items.all()
        ],
    }


def _default_niche(user):
    return user.niche


def _default_platform(user):
    return user.main_platform or "All platforms"


def _is_auto_generated_plan(plan):
    return isinstance(plan.content_plan, dict) and plan.content_plan.get(
        "auto_generated"
    )


def _is_placeholder_topic(topic, niche, day):
    normalized = (topic or "").strip().lower()
    fallback_prefixes = [
        f"{niche.title().lower()} idea for",
        f"create {niche.lower()} content for",
        f"{niche.lower()} content for",
    ]
    return any(normalized.startswith(prefix) for prefix in fallback_prefixes) or normalized == ""


def _sync_weekly_plan_items(plan, niche):
    from apps.ai.services.planner_generator import PlannerGeneratorService

    daily_topics = PlannerGeneratorService.generate_daily_topics(niche)
    days = (
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    )
    existing_items = {item.day_name: item for item in plan.items.all()}

    for day in days:
        topic = daily_topics.get(day, f"{niche.title()} idea for {day}")
        item = existing_items.get(day)

        if item is None:
            PlannedContent.objects.create(
                content_plan=plan,
                day_name=day,
                topic=topic,
                status="planned",
            )
            continue

        if _is_placeholder_topic(item.topic, niche, day):
            item.topic = topic
            item.save(update_fields=["topic"])


def _ensure_weekly_plan(user):
    if not user.niche:
        return None

    week_start = _current_week_start()
    title = f"Weekly plan - {week_start.isoformat()}"
    niche = _default_niche(user)
    platform = _default_platform(user)

    plan, created = ContentPlan.objects.get_or_create(
        user=user,
        title=title,
        week_start=week_start,
        defaults={
            "niche": niche,
            "platform": platform,
            "content_plan": {
                "period": "weekly",
                "period_key": week_start.isoformat(),
                "auto_generated": True,
            },
        },
    )

    plan_is_auto = _is_auto_generated_plan(plan)
    niche_changed = plan_is_auto and plan.niche != niche
    platform_changed = plan_is_auto and plan.platform != platform

    if niche_changed or platform_changed:
        plan.niche = niche
        plan.platform = platform
        plan.save(update_fields=["niche", "platform"])

    if niche_changed:
        plan.items.all().delete()

    if created or niche_changed or not plan.items.exists():
        _sync_weekly_plan_items(plan, niche)
    else:
        existing_items = list(plan.items.all())
        if any(_is_placeholder_topic(item.topic, niche, item.day_name) for item in existing_items):
            _sync_weekly_plan_items(plan, niche)

    return plan


def _ensure_monthly_plan(user):
    if not user.niche:
        return None

    month_start = _current_month_start()
    _, days_in_month = monthrange(month_start.year, month_start.month)
    title = f"Monthly plan - {month_start:%Y-%m}"
    niche = _default_niche(user)
    platform = _default_platform(user)

    plan, created = ContentPlan.objects.get_or_create(
        user=user,
        title=title,
        week_start=month_start,
        defaults={
            "niche": niche,
            "platform": platform,
            "content_plan": {
                "period": "monthly",
                "period_key": f"{month_start:%Y-%m}",
                "auto_generated": True,
                "days_in_month": days_in_month,
            },
        },
    )

    plan_is_auto = _is_auto_generated_plan(plan)
    niche_changed = plan_is_auto and plan.niche != niche
    platform_changed = plan_is_auto and plan.platform != platform

    if niche_changed or platform_changed:
        plan.niche = niche
        plan.platform = platform
        plan.save(update_fields=["niche", "platform"])

    if niche_changed:
        plan.items.all().delete()

    if created or niche_changed:
        PlannedContent.objects.bulk_create(
            [
                PlannedContent(
                    content_plan=plan,
                    day_name=f"Week {week_number}",
                    topic=f"{niche.title()} monthly theme {week_number}",
                    status="planned",
                )
                for week_number in range(1, 5)
            ]
        )

    return plan


def ensure_current_plans(user):
    return _ensure_weekly_plan(user), _ensure_monthly_plan(user)


class GeneratePlanView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = GeneratePlanSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        ai_text = PlannerGeneratorService.generate(
            niche=data["niche"]
        )

        plan = ContentPlan.objects.create(
            user=request.user,
            title=data["title"],
            niche=data["niche"],
            platform=data["platform"],
            week_start=data["week_start"],
            content_plan={
                "raw": ai_text,
            },
        )

        days = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ]

        for day in days:
            PlannedContent.objects.create(
                content_plan=plan,
                day_name=day,
                topic=f"{data['niche']} content for {day}",
                status="planned",
                script="",
            )

        return Response(
            {
                "id": plan.id,
                "title": plan.title,
                "week_start": plan.week_start,
                "content_plan": plan.content_plan,
            },
            status=status.HTTP_201_CREATED,
        )


class ListPlansView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        ensure_current_plans(request.user)

        plans = (
            ContentPlan.objects
            .filter(user=request.user)
            .prefetch_related("items")
        )

        return Response([_plan_payload(plan) for plan in plans])


class CurrentPlansView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.niche:
            return Response(
                {
                    "missing_niche": True,
                    "message": "Complete your profile with a niche to unlock planner suggestions.",
                },
                status=status.HTTP_200_OK,
            )

        weekly_plan, monthly_plan = ensure_current_plans(request.user)
        plans = (
            ContentPlan.objects
            .filter(id__in=[weekly_plan.id, monthly_plan.id])
            .prefetch_related("items")
            .order_by("week_start")
        )

        return Response(
            {
                "weekly": _plan_payload(
                    next(plan for plan in plans if plan.id == weekly_plan.id)
                ),
                "monthly": _plan_payload(
                    next(plan for plan in plans if plan.id == monthly_plan.id)
                ),
            }
        )
