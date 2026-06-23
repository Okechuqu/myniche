from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User
from .serializers import (
    LoginSerializer,
    PasswordChangeSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    ProfileUpdateSerializer,
    RegisterSerializer,
    UserSerializer,
)
from .services.google_auth import GoogleAuthService
from .services.jwt_service import JWTService

from dj_rest_auth.registration.views import SocialLoginView
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


class ProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        serializer = ProfileUpdateSerializer(
            request.user,
            data=request.data,
            partial=True,
            context={
                "request": request
            },
        )
        serializer.is_valid(
            raise_exception=True
        )
        user = serializer.save()

        return Response(
            UserSerializer(user).data
        )


class PasswordChangeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PasswordChangeSerializer(
            data=request.data,
            context={
                "request": request
            },
        )
        serializer.is_valid(
            raise_exception=True
        )
        user = serializer.save()

        return Response(
            {
                "detail": "Password updated successfully",
                "user": UserSerializer(user).data,
            }
        )


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(
            data=request.data
        )
        serializer.is_valid(
            raise_exception=True
        )
        reset_url = serializer.save()

        response_data = {
            "detail": (
                "If an account exists for that email, "
                "a password reset link has been sent."
            )
        }

        if settings.DEBUG and reset_url:
            response_data["reset_url"] = reset_url

        return Response(response_data)


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(
            data=request.data
        )
        serializer.is_valid(
            raise_exception=True
        )
        serializer.save()

        return Response(
            {
                "detail": "Password has been reset successfully"
            }
        )


class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        google_token = (
            request.data.get("id_token")
            or request.data.get("credential")
            or request.data.get("token")
        )

        if not google_token:
            return Response(
                {
                    "detail": "Google ID token is required"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = GoogleAuthService.authenticate(
                google_token,
                settings.GOOGLE_CLIENT_ID
            )
        except ValueError as exc:
            return Response(
                {
                    "detail": str(exc)
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


class FacebookLoginView(SocialLoginView):
    adapter_class = FacebookOAuth2Adapter
    client_class = OAuth2Client
    permission_classes = [AllowAny]
