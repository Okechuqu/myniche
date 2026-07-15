from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(unique=True)

    niche = models.CharField(max_length=100, blank=True)
    main_platform = models.CharField(max_length=100, blank=True)
    creator_goal = models.CharField(max_length=255, blank=True)
    avatar = models.URLField(blank=True)
    agreed_to_privacy = models.BooleanField(default=False)

    provider = models.CharField(max_length=50, default="email")
    google_sub = models.CharField(
        max_length=255,
        unique=True,
        null=True,
        blank=True,
    )
    plan_name = models.CharField(max_length=50, default="free")
    script_quota = models.PositiveIntegerField(default=20)

    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]
