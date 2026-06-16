from django.urls import path

from .views import GeneratePlanView, ListPlansView

urlpatterns = [
    path("generate/", GeneratePlanView.as_view()),
    path("", ListPlansView.as_view()),
]
