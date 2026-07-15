from unittest.mock import patch

from datetime import timedelta

from django.contrib.auth import get_user_model
from django.test import override_settings
from django.utils import timezone
from rest_framework.test import APITestCase

from apps.ai.tasks import generate_script_task
from apps.jobs.models import AIJob
from apps.planner.models import ContentPlan, PlannedContent
from apps.scripts.models import Script


class ScriptRouteTests(APITestCase):
    def test_script_list_requires_auth(self):
        response = self.client.get("/api/scripts/")
        self.assertIn(response.status_code, [401, 403])

    def test_user_can_delete_own_script(self):
        user = get_user_model().objects.create_user(
            username="script-owner",
            email="script-owner@example.com",
            password="password123",
        )
        script = Script.objects.create(
            user=user,
            title="Owned script",
            niche="AI tools",
            platform="TikTok/Reels",
            topic="How to build faster",
            content="script content",
        )
        self.client.force_authenticate(user=user)

        response = self.client.delete(f"/api/scripts/{script.id}/")

        self.assertEqual(response.status_code, 204)
        self.assertFalse(Script.objects.filter(id=script.id).exists())

    def test_user_cannot_delete_another_users_script(self):
        owner = get_user_model().objects.create_user(
            username="script-owner-2",
            email="script-owner-2@example.com",
            password="password123",
        )
        other = get_user_model().objects.create_user(
            username="script-other",
            email="script-other@example.com",
            password="password123",
        )
        script = Script.objects.create(
            user=owner,
            title="Owned script",
            niche="AI tools",
            platform="TikTok/Reels",
            topic="How to build faster",
            content="script content",
        )
        self.client.force_authenticate(user=other)

        response = self.client.delete(f"/api/scripts/{script.id}/")

        self.assertEqual(response.status_code, 404)
        self.assertTrue(Script.objects.filter(id=script.id).exists())

    def test_script_job_falls_back_to_sync_execution_when_task_queue_is_unavailable(self):
        user = get_user_model().objects.create_user(
            username="generator",
            email="generator@example.com",
            password="password123",
        )
        self.client.force_authenticate(user=user)

        task = patch("apps.jobs.views.generate_script_task")
        mocked_task = task.start()
        mocked_task.delay.side_effect = RuntimeError("broker unavailable")

        try:
            response = self.client.post(
                "/api/jobs/scripts/",
                {
                    "niche": "AI tools",
                    "platform": "TikTok/Reels",
                    "topic": "How to build faster",
                    "tone": "casual",
                },
                format="json",
            )
        finally:
            task.stop()

        self.assertEqual(response.status_code, 202)
        self.assertTrue(AIJob.objects.filter(user=user).exists())
        mocked_task.delay.assert_called_once()
        mocked_task.run.assert_called_once()

    def test_generate_script_task_updates_planner_item_when_topic_matches(self):
        user = get_user_model().objects.create_user(
            username="planneruser",
            email="planner@example.com",
            password="password123",
        )

        today = timezone.localdate()
        week_start = today - timedelta(days=today.weekday())
        plan = ContentPlan.objects.create(
            user=user,
            title="Weekly plan - test",
            niche="creator growth",
            platform="TikTok/Reels",
            week_start=week_start,
            content_plan={"period": "weekly",
                          "period_key": week_start.isoformat()},
        )

        item = PlannedContent.objects.create(
            content_plan=plan,
            day_name="Monday",
            topic="How to build faster",
            status="planned",
            script="",
        )

        job = AIJob.objects.create(
            user=user,
            job_type=AIJob.JobType.SCRIPT,
            payload={
                "niche": "AI tools",
                "platform": "TikTok/Reels",
                "topic": "How to build faster",
                "tone": "casual",
                "count": 1,
            },
        )

        with patch("apps.ai.tasks.ScriptGeneratorService.generate", return_value="first script"):
            generate_script_task.run(job.id)

        item.refresh_from_db()
        self.assertEqual(item.script, "first script")

    def test_generate_script_task_creates_multiple_scripts(self):
        user = get_user_model().objects.create_user(
            username="generator2",
            email="generator2@example.com",
            password="password123",
        )

        job = AIJob.objects.create(
            user=user,
            job_type=AIJob.JobType.SCRIPT,
            payload={
                "niche": "AI tools",
                "platform": "TikTok/Reels",
                "topic": "How to build faster",
                "tone": "casual",
                "count": 2,
            },
        )

        with patch("apps.ai.tasks.ScriptGeneratorService.generate", side_effect=["first script", "second script"]):
            generate_script_task.run(job.id)

        self.assertEqual(Script.objects.filter(user=user).count(), 2)
        updated_job = AIJob.objects.get(id=job.id)
        self.assertEqual(updated_job.status, AIJob.Status.COMPLETED)
        self.assertEqual(
            updated_job.result["scripts"][0]["content"], "first script")
        self.assertEqual(
            updated_job.result["scripts"][1]["content"], "second script")
