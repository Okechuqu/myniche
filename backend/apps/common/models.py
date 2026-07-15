from django.db import models
from apps.accounts.models import User


class AuditLog(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    action = models.CharField(max_length=100)
    entity = models.CharField(max_length=100)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class MaintenanceFlag(models.Model):
    """Singleton-style flag to control maintenance mode at runtime."""

    enabled = models.BooleanField(default=False)
    message = models.CharField(max_length=255, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Maintenance Flag"
        verbose_name_plural = "Maintenance Flag"

    def __str__(self):
        return f"Maintenance: {'on' if self.enabled else 'off'}"
