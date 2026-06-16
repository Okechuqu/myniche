from django.urls import path

from .views import GenerateScriptView, ListScriptsView

urlpatterns = [
    path("generate/", GenerateScriptView.as_view()),
    path("", ListScriptsView.as_view()),
]
