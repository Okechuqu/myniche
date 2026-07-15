from django.urls import path
from .views import (
    PublicDemoGenerateView,
    SiteConfigurationView,
    SiteContentListView,
    SiteContentDetailView,
)

urlpatterns = [
    path("demo/generate/", PublicDemoGenerateView.as_view()),
    path("config/", SiteConfigurationView.as_view(), name="site-configuration"),
    path("contents/", SiteContentListView.as_view(), name="site-content-list"),
    path("content/<slug:slug>/", SiteContentDetailView.as_view(),
         name="site-content-detail"),
]
