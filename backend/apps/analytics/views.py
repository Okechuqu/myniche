from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

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
