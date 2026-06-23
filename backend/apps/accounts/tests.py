from unittest.mock import patch

from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.test import override_settings
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework.test import APITestCase

from apps.accounts.services.google_auth import GoogleAuthService


class AuthTests(APITestCase):
    def test_login_returns_tokens_and_user(self):
        user_model = get_user_model()
        user_model.objects.create_user(
            email="test@example.com",
            username="tester",
            password="password123",
        )

        response = self.client.post(
            "/api/accounts/login/",
            {
                "email": "test@example.com",
                "password": "password123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertEqual(response.data["user"]["email"], "test@example.com")

    def test_register(self):
        response = self.client.post(
            "/api/accounts/register/",
            {
                "email": "test@example.com",
                "username": "tester",
                "password": "password123",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)

    def test_login_requires_valid_credentials(self):
        response = self.client.post(
            "/api/accounts/login/",
            {
                "email": "missing@example.com",
                "password": "wrongpass",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_user_response_includes_password_status(self):
        user_model = get_user_model()
        user_model.objects.create_user(
            email="password-status@example.com",
            username="password-status",
            password="password123",
        )

        response = self.client.post(
            "/api/accounts/login/",
            {
                "email": "password-status@example.com",
                "password": "password123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["user"]["has_usable_password"])

    def test_email_user_can_change_password(self):
        user_model = get_user_model()
        user = user_model.objects.create_user(
            email="change@example.com",
            username="change",
            password="old-password-123",
        )
        self.client.force_authenticate(user=user)

        response = self.client.post(
            "/api/accounts/password/change/",
            {
                "current_password": "old-password-123",
                "new_password": "new-password-123",
                "confirm_password": "new-password-123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        user.refresh_from_db()
        self.assertTrue(user.check_password("new-password-123"))
        self.assertTrue(response.data["user"]["has_usable_password"])

    def test_email_user_change_password_requires_current_password(self):
        user_model = get_user_model()
        user = user_model.objects.create_user(
            email="bad-current@example.com",
            username="bad-current",
            password="old-password-123",
        )
        self.client.force_authenticate(user=user)

        response = self.client.post(
            "/api/accounts/password/change/",
            {
                "current_password": "wrong-password",
                "new_password": "new-password-123",
                "confirm_password": "new-password-123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("current_password", response.data)

    def test_social_user_can_set_first_password_without_current_password(self):
        user_model = get_user_model()
        user = user_model.objects.create_user(
            email="social-password@example.com",
            username="social-password",
            password=None,
            provider="google",
            google_sub="social-sub",
        )
        self.client.force_authenticate(user=user)

        response = self.client.post(
            "/api/accounts/password/change/",
            {
                "new_password": "new-password-123",
                "confirm_password": "new-password-123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        user.refresh_from_db()
        self.assertTrue(user.has_usable_password())
        self.assertTrue(user.check_password("new-password-123"))

    @override_settings(
        DEBUG=True,
        FRONTEND_URL="http://localhost:3000",
    )
    def test_password_reset_request_returns_generic_message_and_debug_url(self):
        user_model = get_user_model()
        user_model.objects.create_user(
            email="reset@example.com",
            username="reset",
            password="old-password-123",
        )

        response = self.client.post(
            "/api/accounts/password/reset/",
            {
                "email": "reset@example.com"
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn("detail", response.data)
        self.assertIn("reset_url", response.data)
        self.assertIn("/reset-password?", response.data["reset_url"])

    def test_password_reset_confirm_sets_new_password(self):
        user_model = get_user_model()
        user = user_model.objects.create_user(
            email="confirm-reset@example.com",
            username="confirm-reset",
            password=None,
            provider="google",
            google_sub="confirm-reset-sub",
        )
        uid = urlsafe_base64_encode(
            force_bytes(user.pk)
        )
        token = default_token_generator.make_token(
            user
        )

        response = self.client.post(
            "/api/accounts/password/reset/confirm/",
            {
                "uid": uid,
                "token": token,
                "new_password": "new-password-123",
                "confirm_password": "new-password-123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        user.refresh_from_db()
        self.assertTrue(user.check_password("new-password-123"))

    @patch("apps.accounts.views.GoogleAuthService.authenticate")
    def test_google_login_returns_tokens_and_user(self, authenticate):
        user_model = get_user_model()
        user = user_model.objects.create_user(
            email="google@example.com",
            username="google-user",
            password=None,
        )
        authenticate.return_value = user

        response = self.client.post(
            "/api/accounts/social/google/",
            {
                "id_token": "google-id-token",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertEqual(response.data["user"]["email"], "google@example.com")
        self.assertEqual(
            authenticate.call_args.args[0],
            "google-id-token",
        )

    def test_google_login_requires_id_token(self):
        response = self.client.post(
            "/api/accounts/social/google/",
            {},
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data["detail"],
            "Google ID token is required",
        )

    @patch(
        "apps.accounts.services.google_auth.id_token.verify_oauth2_token"
    )
    def test_google_auth_service_creates_google_user(self, verify_token):
        verify_token.return_value = {
            "iss": "https://accounts.google.com",
            "sub": "google-sub-123",
            "email": "new-google@example.com",
            "email_verified": True,
            "picture": "https://example.com/avatar.png",
        }

        user = GoogleAuthService.authenticate(
            "google-id-token",
            "google-client-id",
        )

        self.assertEqual(user.email, "new-google@example.com")
        self.assertEqual(user.google_sub, "google-sub-123")
        self.assertEqual(user.provider, "google")
        self.assertEqual(user.avatar, "https://example.com/avatar.png")

    @patch(
        "apps.accounts.services.google_auth.id_token.verify_oauth2_token"
    )
    def test_google_auth_rejects_mismatched_google_subject(
        self,
        verify_token,
    ):
        user_model = get_user_model()
        user_model.objects.create_user(
            email="linked-google@example.com",
            username="linked-google",
            password=None,
            provider="google",
            google_sub="original-sub",
        )
        verify_token.return_value = {
            "iss": "https://accounts.google.com",
            "sub": "different-sub",
            "email": "linked-google@example.com",
            "email_verified": True,
        }

        with self.assertRaisesMessage(
            ValueError,
            "Google account does not match this user",
        ):
            GoogleAuthService.authenticate(
                "google-id-token",
                "google-client-id",
            )
