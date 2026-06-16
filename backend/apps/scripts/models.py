from django.db import models
from apps.accounts.models import User

# Create your models here.


class Script(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="scripts"
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

    topic = models.CharField(
        max_length=255
    )

    content = models.TextField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:

        ordering = [
            "-created_at"
        ]
