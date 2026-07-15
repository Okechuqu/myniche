from unittest.mock import patch

from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from apps.ai.services.planner_generator import PlannerGeneratorService
from apps.planner.models import ContentPlan, PlannedContent


class PlannerRouteTests(APITestCase):
    def test_plan_list_requires_auth(self):
        response = self.client.get("/api/planner/")
        self.assertIn(response.status_code, [401, 403])

    def test_current_plans_requires_profile_niche(self):
        user_model = get_user_model()
        user = user_model.objects.create_user(
            username="creator",
            email="creator@example.com",
            password="password123",
            niche="",
        )
        self.client.force_authenticate(user=user)

        response = self.client.get("/api/planner/current/")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data.get("missing_niche"))
        self.assertIn("Complete your profile",
                      response.data.get("message", ""))

    def test_current_plans_generates_weekly_plan_from_profile_niche(self):
        user_model = get_user_model()
        user = user_model.objects.create_user(
            username="creator2",
            email="creator2@example.com",
            password="password123",
            niche="fitness",
            main_platform="TikTok",
        )
        self.client.force_authenticate(user=user)

        response = self.client.get("/api/planner/current/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("weekly", response.data)
        self.assertIn("monthly", response.data)
        self.assertEqual(len(response.data["weekly"]["items"]), 7)
        self.assertEqual(response.data["weekly"]["niche"], "fitness")
        self.assertEqual(response.data["weekly"]["platform"], "TikTok")
        # Check that all items have non-empty topics
        self.assertTrue(all(
            item["topic"] and len(item["topic"]) > 0
            for item in response.data["weekly"]["items"]
        ))

    def test_daily_topics_prompt_uses_multiple_niches(self):
        with patch("apps.ai.services.planner_generator.AIProviderFactory.get_provider") as mock_get_provider:
            provider = mock_get_provider.return_value
            provider.generate_plan.return_value = (
                "Monday: Start with a hook\n"
                "Tuesday: Share a story\n"
                "Wednesday: Explain a framework\n"
                "Thursday: Show a before and after\n"
                "Friday: Invite feedback\n"
                "Saturday: Offer a checklist\n"
                "Sunday: Recap the week"
            )

            topics = PlannerGeneratorService.generate_daily_topics(
                "fitness, productivity")

            self.assertEqual(len(topics), 7)
            self.assertIn("Monday", topics)
            self.assertIn("Sunday", topics)
            prompt = provider.generate_plan.call_args.args[0]
            self.assertIn("fitness", prompt.lower())
            self.assertIn("productivity", prompt.lower())
            self.assertIn("progressively build", prompt.lower())

    def test_existing_weekly_plan_refreshes_placeholder_topics(self):
        user = get_user_model().objects.create_user(
            username="planner-refresh",
            email="planner-refresh@example.com",
            password="password123",
            niche="fitness",
        )
        plan = ContentPlan.objects.create(
            user=user,
            title="Weekly plan - test",
            niche="fitness",
            platform="All platforms",
            week_start="2026-07-01",
            content_plan={"period": "weekly"},
        )
        PlannedContent.objects.create(
            content_plan=plan,
            day_name="Monday",
            topic="Fitness idea for Monday",
            status="planned",
        )

        with patch("apps.ai.services.planner_generator.AIProviderFactory.get_provider") as mock_get_provider:
            provider = mock_get_provider.return_value
            provider.generate_plan.return_value = (
                "Monday: Build a morning routine\n"
                "Tuesday: Share a meal prep tip\n"
                "Wednesday: Explain recovery habits\n"
                "Thursday: Show a workout split\n"
                "Friday: Talk about consistency\n"
                "Saturday: Share a progress check-in\n"
                "Sunday: Wrap up the week"
            )

            from apps.planner.views import _ensure_weekly_plan

            refreshed_plan = _ensure_weekly_plan(user)

        refreshed_item = refreshed_plan.items.get(day_name="Monday")
        self.assertEqual(refreshed_item.topic, "Build a morning routine")

    def test_daily_topics_fall_back_when_ai_provider_fails(self):
        with patch("apps.ai.services.planner_generator.AIProviderFactory.get_provider") as mock_get_provider:
            provider = mock_get_provider.return_value
            provider.generate_plan.side_effect = Exception(
                "provider unavailable")

            topics = PlannerGeneratorService.generate_daily_topics("fitness")

            self.assertEqual(len(topics), 7)
            self.assertIn("Monday", topics)
            self.assertNotIn("idea for", topics["Monday"].lower())
            self.assertIn("fitness", topics["Monday"].lower())
