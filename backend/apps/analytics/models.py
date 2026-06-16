from django.db import models

from apps.accounts.models import User


class AnalyticsSnapshot(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="analytics_snapshots",
    )

    platform = models.CharField(
        max_length=100
    )

    views = models.PositiveIntegerField(
        default=0
    )

    likes = models.PositiveIntegerField(
        default=0
    )

    comments = models.PositiveIntegerField(
        default=0
    )

    shares = models.PositiveIntegerField(
        default=0
    )

    retention_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["-created_at"]
