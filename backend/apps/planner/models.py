from django.db import models

# Create your models here.
from django.db import models

from apps.accounts.models import User


class ContentPlan(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="content_plans",
    )

    title = models.CharField(
        max_length=255
    )

    niche = models.CharField(
        max_length=100
    )

    platform = models.CharField(
        max_length=100
    )

    week_start = models.DateField()

    content_plan = models.JSONField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["-created_at"]


class PlannedContent(models.Model):
    content_plan = models.ForeignKey(
        ContentPlan,
        on_delete=models.CASCADE,
        related_name="items",
    )

    day_name = models.CharField(
        max_length=20
    )

    topic = models.CharField(
        max_length=255
    )

    status = models.CharField(
        max_length=30,
        default="planned",
    )

    script = models.TextField(
        blank=True
    )

    generated_title = models.CharField(
        max_length=255,
        blank=True,
    )

    generated_variant = models.CharField(
        max_length=100,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["day_name"]
