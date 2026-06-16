from django.urls import path

from .views import (
    CreateScriptJobView,
    JobDetailView
)

urlpatterns = [

    path(
        "scripts/",
        CreateScriptJobView.as_view()
    ),

    path(
        "<int:job_id>/",
        JobDetailView.as_view()
    ),
]
