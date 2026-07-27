from django.conf import settings
from django.http import JsonResponse
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
from .services.privacy import PrivacyService



class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        # Ensure the agreed_to_privacy is validated at serializer level; forward request
        return super().create(request, *args, **kwargs)


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
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def delete(self, request):
        try:
            PrivacyService.erase_user_data(request.user)
        except Exception:
            return Response(
                {"detail": "Account deletion could not be completed. Please try again or contact support."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)


class DataExportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        response = JsonResponse(PrivacyService.export_user_data(request.user))
        response["Content-Disposition"] = 'attachment; filename="reelsdraft-personal-data.json"'
        return response


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
                settings.GOOGLE_CLIENT_ID,
                request.data.get("agreed_to_privacy") is True,
                request.data.get("agreed_to_terms") is True,
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


class PlansView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        plans = [
            {
                "title": "Free",
                "price": "0",
                "description": "Start with a limited creator workspace.",
                "features": [
                    "20 scripts / month",
                    "1 seat (individual)",
                    "Standard support",
                    "Basic planner & analytics",
                ],
            },
            {
                "title": "Creator",
                "price": "19",
                "description": "Unlimited scripts, planner, and pro workflows.",
                "features": [
                    "Unlimited scripts",
                    "Up to 5 seats",
                    "Priority support",
                    "Advanced planner & workflow automations",
                ],
            },
            {
                "title": "Agency",
                "price": "49",
                "description": "Team collaboration, analytics, and growth tools.",
                "features": [
                    "Unlimited scripts & seats",
                    "Team workspace & roles",
                    "Advanced analytics",
                    "White-labeling & SSO",
                ],
            },
        ]

        return Response(plans)
