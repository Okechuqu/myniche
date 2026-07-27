from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from apps.common.models import AuditLog, CookieConsent
from apps.planner.models import ContentPlan, PlannedContent


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

    def test_user_can_export_own_personal_data(self):
        user = get_user_model().objects.create_user(
            username="exportuser",
            email="export@example.com",
            password="password123",
        )
        self.client.force_authenticate(user=user)

        response = self.client.get("/api/accounts/me/export/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["account"]["email"], user.email)
        self.assertEqual(
            response["Content-Disposition"],
            'attachment; filename="reelsdraft-personal-data.json"',
        )

    def test_export_includes_account_linked_records(self):
        user = get_user_model().objects.create_user(
            username="exportrecords",
            email="records@example.com",
            password="password123",
            agreed_to_terms=True,
            terms_version="2026-07-21",
        )
        plan = ContentPlan.objects.create(
            user=user,
            title="Weekly plan",
            niche="fitness",
            platform="TikTok",
            week_start="2026-07-27",
            content_plan={},
        )
        PlannedContent.objects.create(
            content_plan=plan,
            day_name="Monday",
            topic="Warmup",
        )
        AuditLog.objects.create(user=user, action="GET", entity="/api/accounts/me/")
        CookieConsent.objects.create(
            user=user,
            accepted=True,
            policy_version="2026-07-21",
            purposes=["essential_storage"],
            anonymous_id="test-consent-id",
        )
        self.client.force_authenticate(user=user)

        response = self.client.get("/api/accounts/me/export/")
        payload = response.json()

        self.assertEqual(payload["account"]["terms_version"], "2026-07-21")
        self.assertEqual(len(payload["planned_content"]), 1)
        self.assertEqual(len(payload["audit_logs"]), 1)
        self.assertEqual(len(payload["cookie_consents"]), 1)
