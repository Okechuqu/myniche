from django.contrib.auth import authenticate
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .services.jwt_service import (JWTService)

from .models import User
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer

from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class LoginView(APIView):

    permission_classes = [
        AllowAny
    ]

    def post(self, request):

        serializer = (
            LoginSerializer(
                data=request.data
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        email = (
            serializer.validated_data[
                "email"
            ]
        )

        password = (
            serializer.validated_data[
                "password"
            ]
        )

        user = authenticate(
            request,
            email=email,
            password=password
        )

        if not user:

            return Response(
                {
                    "detail":
                    "Invalid credentials"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        auth_payload = JWTService.create_tokens(
            user
        )
        auth_payload["user"] = UserSerializer(
            user
        ).data

        return Response(
            auth_payload
        )


class MeView(APIView):
    def get(self, request):
        return Response(UserSerializer(request.user).data)


class GoogleLoginView(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client
    permission_classes = [AllowAny]


class FacebookLoginView(SocialLoginView):
    adapter_class = FacebookOAuth2Adapter
    client_class = OAuth2Client
    permission_classes = [AllowAny]
