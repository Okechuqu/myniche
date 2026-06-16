from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase


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
