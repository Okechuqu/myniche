from django.urls import path

from .views import GenerateScriptView, ListScriptsView, ScriptDetailView

urlpatterns = [
    path("generate/", GenerateScriptView.as_view()),
    path("", ListScriptsView.as_view()),
    path("<int:script_id>/", ScriptDetailView.as_view()),
]
