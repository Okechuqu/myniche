from google.oauth2 import id_token

from google.auth.transport import requests
from django.utils.text import slugify
from django.conf import settings
from django.utils import timezone

from apps.accounts.models import User


class GoogleAuthService:

    @staticmethod
    def authenticate(
        google_token: str,
        client_id: str,
        agreed_to_privacy: bool,
        agreed_to_terms: bool,
    ):
        if not client_id:
            raise ValueError("Google client ID is not configured")

        payload = id_token.verify_oauth2_token(
            google_token,
            requests.Request(),
            client_id
        )

        if payload["iss"] not in [
            "accounts.google.com",
            "https://accounts.google.com"
        ]:
            raise ValueError("Invalid issuer")

        google_sub = payload.get("sub")
        email = payload.get("email")

        if not google_sub:
            raise ValueError("Google token is missing a subject")

        if not email:
            raise ValueError("Google token is missing an email")

        if payload.get("email_verified") is not True:
            raise ValueError("Google email is not verified")

        user = User.objects.filter(
            google_sub=google_sub
        ).first()

        if user:
            return user

        user = User.objects.filter(
            email__iexact=email
        ).first()

        if user:
            if (
                user.google_sub
                and user.google_sub != google_sub
            ):
                raise ValueError(
                    "Google account does not match this user"
                )

            update_fields = []

            if not user.google_sub:
                user.google_sub = google_sub
                update_fields.append("google_sub")

            if not user.avatar and payload.get("picture"):
                user.avatar = payload["picture"]
                update_fields.append("avatar")

            if user.provider == "email":
                user.provider = "google"
                update_fields.append("provider")

            if update_fields:
                user.save(update_fields=update_fields)

            return user

        if not agreed_to_privacy:
            raise ValueError("You must accept the privacy policy to create an account")

        if not agreed_to_terms:
            raise ValueError("You must accept the terms of service to create an account")

        user = User.objects.create_user(
            email=email,
            username=GoogleAuthService._unique_username(
                email
            ),
            password=None,
            provider="google",
            google_sub=google_sub,
            avatar=payload.get("picture", ""),
            agreed_to_privacy=True,
            privacy_policy_version=settings.PRIVACY_POLICY_VERSION,
            privacy_accepted_at=timezone.now(),
            agreed_to_terms=True,
            terms_version=settings.TERMS_VERSION,
            terms_accepted_at=timezone.now(),
        )

        return user

    @staticmethod
    def _unique_username(email: str):
        base = slugify(
            email.split("@", 1)[0]
        ) or "google-user"
        base = base[:140]
        username = base
        counter = 1

        while User.objects.filter(
            username=username
        ).exists():
            suffix = f"-{counter}"
            username = (
                f"{base[:150 - len(suffix)]}{suffix}"
            )
            counter += 1

        return username
