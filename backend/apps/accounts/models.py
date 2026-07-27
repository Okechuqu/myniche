from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    email = models.EmailField(unique=True)

    niche = models.CharField(max_length=100, blank=True)
    main_platform = models.CharField(max_length=100, blank=True)
    creator_goal = models.CharField(max_length=255, blank=True)
    avatar = models.URLField(blank=True)
    agreed_to_privacy = models.BooleanField(default=False)
    privacy_policy_version = models.CharField(max_length=32, blank=True)
    privacy_accepted_at = models.DateTimeField(null=True, blank=True)
    agreed_to_terms = models.BooleanField(default=False)
    terms_accepted_at = models.DateTimeField(null=True, blank=True)
    terms_version = models.CharField(max_length=32, blank=True)

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

    def record_privacy_acceptance(self, version):
        self.agreed_to_privacy = True
        self.privacy_policy_version = version
        self.privacy_accepted_at = timezone.now()
        self.save(
            update_fields=(
                "agreed_to_privacy",
                "privacy_policy_version",
                "privacy_accepted_at",
            )
        )

    def record_terms_acceptance(self, version):
        self.agreed_to_terms = True
        self.terms_version = version
        self.terms_accepted_at = timezone.now()
        self.save(
            update_fields=(
                "agreed_to_terms",
                "terms_version",
                "terms_accepted_at",
            )
        )
