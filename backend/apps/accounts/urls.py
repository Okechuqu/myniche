from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    MeView,
    GoogleLoginView,
    FacebookLoginView,
)

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("me/", MeView.as_view()),
    path("social/google/", GoogleLoginView.as_view()),
    path("social/facebook/", FacebookLoginView.as_view()),
]
