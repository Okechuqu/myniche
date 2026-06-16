import requests

from apps.accounts.models import User


class FacebookAuthService:

    @staticmethod
    def authenticate(
        access_token: str
    ):

        response = requests.get(
            "https://graph.facebook.com/me",
            params={
                "fields":
                "id,name,email",
                "access_token":
                access_token,
            }
        )

        data = response.json()

        email = data["email"]

        user, _ = User.objects.get_or_create(
            email=email,
            defaults={
                "username": email,
                "provider": "facebook",
            }
        )

        return user
