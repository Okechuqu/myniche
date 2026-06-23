from datetime import timedelta

from django.db.models import Count, Sum
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.planner.models import PlannedContent
from apps.scripts.models import Script

from .models import AnalyticsSnapshot
from .serializers import AnalyticsSnapshotSerializer


class CreateAnalyticsSnapshotView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AnalyticsSnapshotSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        snapshot = AnalyticsSnapshot.objects.create(
            user=request.user,
            **serializer.validated_data,
        )

        return Response(
            {
                "id": snapshot.id,
                "platform": snapshot.platform,
                "views": snapshot.views,
                "likes": snapshot.likes,
                "comments": snapshot.comments,
                "shares": snapshot.shares,
                "retention_score": snapshot.retention_score,
            }
        )


class ListAnalyticsSnapshotsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        snapshots = (
            AnalyticsSnapshot.objects
            .filter(user=request.user)
            .order_by("-created_at")[:30]
        )

        data = [
            {
                "id": item.id,
                "platform": item.platform,
                "views": item.views,
                "likes": item.likes,
                "comments": item.comments,
                "shares": item.shares,
                "retention_score": item.retention_score,
                "created_at": item.created_at,
            }
            for item in snapshots
        ]

        return Response(data)


class AnalyticsSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.localdate()
        week_start = today - timedelta(days=today.weekday())
        month_start = today.replace(day=1)

        scripts = Script.objects.filter(user=request.user)
        weekly_scripts = scripts.filter(created_at__date__gte=week_start)
        monthly_scripts = scripts.filter(created_at__date__gte=month_start)
        planned_items = PlannedContent.objects.filter(
            content_plan__user=request.user
        )
        completed_items = planned_items.filter(status__iexact="completed")
        latest_snapshots = AnalyticsSnapshot.objects.filter(
            user=request.user
        ).order_by("-created_at")[:30]

        snapshot_totals = latest_snapshots.aggregate(
            views=Sum("views"),
            likes=Sum("likes"),
            comments=Sum("comments"),
            shares=Sum("shares"),
        )
        planned_count = planned_items.count()
        completed_count = completed_items.count()
        consistency_score = (
            round((completed_count / planned_count) * 100)
            if planned_count
            else 0
        )

        recent_scripts = scripts.order_by("-created_at")[:5]
        status_counts = dict(
            planned_items.values_list("status")
            .annotate(total=Count("id"))
        )

        return Response(
            {
                "totals": {
                    "scripts": scripts.count(),
                    "weekly_scripts": weekly_scripts.count(),
                    "monthly_scripts": monthly_scripts.count(),
                    "planned_items": planned_count,
                    "completed_items": completed_count,
                    "consistency_score": consistency_score,
                    "views": snapshot_totals["views"] or 0,
                    "likes": snapshot_totals["likes"] or 0,
                    "comments": snapshot_totals["comments"] or 0,
                    "shares": snapshot_totals["shares"] or 0,
                },
                "planner_status": status_counts,
                "recent_scripts": [
                    {
                        "id": script.id,
                        "title": script.title,
                        "platform": script.platform,
                        "created_at": script.created_at,
                    }
                    for script in recent_scripts
                ],
            }
        )
