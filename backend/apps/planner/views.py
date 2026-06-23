
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
            }
            for item in plan.items.all()
        ],
    }


def _default_niche(user):
    return user.niche or "creator growth"


def _ensure_weekly_plan(user):
    week_start = _current_week_start()
    title = f"Weekly plan - {week_start.isoformat()}"
    niche = _default_niche(user)

    plan, created = ContentPlan.objects.get_or_create(
        user=user,
        title=title,
        week_start=week_start,
        defaults={
            "niche": niche,
            "platform": "All platforms",
            "content_plan": {
                "period": "weekly",
                "period_key": week_start.isoformat(),
                "auto_generated": True,
            },
        },
    )

    if created:
        days = (
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        )
        PlannedContent.objects.bulk_create(
            [
                PlannedContent(
                    content_plan=plan,
                    day_name=day,
                    topic=f"{niche.title()} idea for {day}",
                    status="planned",
                )
                for day in days
            ]
        )

    return plan


def _ensure_monthly_plan(user):
    month_start = _current_month_start()
    _, days_in_month = monthrange(month_start.year, month_start.month)
    title = f"Monthly plan - {month_start:%Y-%m}"
    niche = _default_niche(user)

    plan, created = ContentPlan.objects.get_or_create(
        user=user,
        title=title,
        week_start=month_start,
        defaults={
            "niche": niche,
            "platform": "All platforms",
            "content_plan": {
                "period": "monthly",
                "period_key": f"{month_start:%Y-%m}",
                "auto_generated": True,
                "days_in_month": days_in_month,
            },
        },
    )

    if created:
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
