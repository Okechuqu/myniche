from django.urls import path
from .views import PublicDemoGenerateView

urlpatterns = [
    path(
        "demo/generate/",
        PublicDemoGenerateView.as_view()
    )
]
