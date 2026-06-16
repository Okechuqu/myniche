from google.oauth2 import id_token

from google.auth.transport import requests

from apps.accounts.models import User


class GoogleAuthService:

    @staticmethod
    def authenticate(
        google_token: str,
        client_id: str
    ):

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

        user, _ = User.objects.get_or_create(
            google_sub=payload["sub"],
            defaults={
                "email": payload["email"],
                "username": payload["email"],
                "provider": "google",
            }
        )

        return user
