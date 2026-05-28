from django.urls import path
from .views import ScriptGeneratorView

urlpatterns = [
    path('generate-script', ScriptGeneratorView.as_view(), name='generate_script'),
]
