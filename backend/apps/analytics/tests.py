from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient


class AnalyticsSummaryViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            email="tester@example.com",
            username="tester",
            password="password123",
        )
        self.client.force_authenticate(user=self.user)

    def test_summary_returns_200_for_authenticated_user(self):
        response = self.client.get("/api/analytics/summary/")

        self.assertEqual(response.status_code, 200)
        self.assertIn("totals", response.json())
