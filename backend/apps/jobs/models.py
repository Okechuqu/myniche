from django.db import models

from apps.accounts.models import User


class AIJob(models.Model):

    class Status(models.TextChoices):

        PENDING = (
            "pending",
            "Pending"
        )

        PROCESSING = (
            "processing",
            "Processing"
        )

        COMPLETED = (
            "completed",
            "Completed"
        )

        FAILED = (
            "failed",
            "Failed"
        )

    class JobType(models.TextChoices):

        SCRIPT = (
            "script",
            "Script"
        )

        PLAN = (
            "plan",
            "Plan"
        )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="jobs"
    )

    job_type = models.CharField(
        max_length=50,
        choices=JobType.choices
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    payload = models.JSONField()

    result = models.JSONField(
        null=True,
        blank=True
    )

    error_message = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )
