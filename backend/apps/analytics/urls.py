from django.urls import path

from .views import (
    AnalyticsSummaryView,
    CreateAnalyticsSnapshotView,
    ListAnalyticsSnapshotsView,
)

urlpatterns = [
    path("", ListAnalyticsSnapshotsView.as_view()),
    path("summary/", AnalyticsSummaryView.as_view()),
    path("create/", CreateAnalyticsSnapshotView.as_view()),
]
