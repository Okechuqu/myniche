from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase


class PublicAuthRouteTests(APITestCase):
    def test_me_requires_auth(self):
        response = self.client.get("/api/accounts/me/")
        self.assertIn(response.status_code, [401, 403])

    def test_user_can_delete_own_account(self):
        user = get_user_model().objects.create_user(
            username="deleteuser",
            email="delete@example.com",
            password="password123",
        )
        self.client.force_authenticate(user=user)

        response = self.client.delete("/api/accounts/me/")

        self.assertEqual(response.status_code, 204)
        self.assertFalse(
            get_user_model().objects.filter(email="delete@example.com").exists()
        )

    def test_profile_update_saves_main_platform(self):
        user = get_user_model().objects.create_user(
            username="profileuser",
            email="profile@example.com",
            password="password123",
        )
        self.client.force_authenticate(user=user)

        response = self.client.patch(
            "/api/accounts/profile/",
            {
                "username": "profileuser",
                "niche": "fitness",
                "main_platform": "TikTok",
                "creator_goal": "Publish daily short-form videos",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["main_platform"], "TikTok")

        user.refresh_from_db()
        self.assertEqual(user.main_platform, "TikTok")
