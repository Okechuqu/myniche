from django.urls import path

from .views import (
    CreateAnalyticsSnapshotView,
    ListAnalyticsSnapshotsView,
)

urlpatterns = [
    path("", ListAnalyticsSnapshotsView.as_view()),
    path("create/", CreateAnalyticsSnapshotView.as_view()),
]
