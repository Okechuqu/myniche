from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    MeView,
    DataExportView,
    ProfileUpdateView,
    PasswordChangeView,
    PasswordResetConfirmView,
    PasswordResetRequestView,
    GoogleLoginView,
    PlansView,
)

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("me/", MeView.as_view()),
    path("me/export/", DataExportView.as_view()),
    path("profile/", ProfileUpdateView.as_view()),
    path("plans/", PlansView.as_view()),
    path("password/change/", PasswordChangeView.as_view()),
    path("password/reset/", PasswordResetRequestView.as_view()),
    path("password/reset/confirm/", PasswordResetConfirmView.as_view()),
    path("social/google/", GoogleLoginView.as_view()),
]
