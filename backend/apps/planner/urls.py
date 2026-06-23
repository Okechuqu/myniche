from django.urls import path

from .views import CurrentPlansView, GeneratePlanView, ListPlansView

urlpatterns = [
    path("generate/", GeneratePlanView.as_view()),
    path("current/", CurrentPlansView.as_view()),
    path("", ListPlansView.as_view()),
]
