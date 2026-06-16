

from django.utils.dateparse import parse_date
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ContentPlan, PlannedContent
from .serializers import GeneratePlanSerializer
from .services.planner_generator import PlannerGeneratorService


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
        plans = (
            ContentPlan.objects
            .filter(user=request.user)
            .prefetch_related("items")
        )

        payload = []
        for plan in plans:
            payload.append(
                {
                    "id": plan.id,
                    "title": plan.title,
                    "niche": plan.niche,
                    "platform": plan.platform,
                    "week_start": plan.week_start,
                    "created_at": plan.created_at,
                    "items": [
                        {
                            "id": item.id,
                            "day_name": item.day_name,
                            "topic": item.topic,
                            "status": item.status,
                        }
                        for item in plan.items.all()
                    ],
                }
            )

        return Response(payload)
