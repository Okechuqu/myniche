from django.urls import path
from .views import (
    PublicDemoGenerateView,
    SiteConfigurationView,
    SiteContentListView,
    SiteContentDetailView,
    TermsOfServiceView,
)

urlpatterns = [
    path("demo/generate/", PublicDemoGenerateView.as_view()),
    path("config/", SiteConfigurationView.as_view(), name="site-configuration"),
    path("contents/", SiteContentListView.as_view(), name="site-content-list"),
    path("content/<slug:slug>/", SiteContentDetailView.as_view(),
         name="site-content-detail"),
    path("terms/", TermsOfServiceView.as_view(), name="terms-of-service"),
]
