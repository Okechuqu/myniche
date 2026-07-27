from datetime import timedelta

from django.conf import settings
from django.utils import timezone

from apps.analytics.models import AnalyticsSnapshot
from apps.common.models import AuditLog
from apps.common.models import CookieConsent
from apps.jobs.models import AIJob
from apps.planner.models import ContentPlan
from apps.planner.models import PlannedContent
from apps.scripts.models import Script

from .supabase_profile import SupabaseProfileService


class PrivacyService:
    """Centralizes user data exports and erasure across managed stores."""

    @staticmethod
    def export_user_data(user):
        profile = SupabaseProfileService.get_profile(user.id) or {}
        return {
            "exported_at": timezone.now().isoformat(),
            "privacy_policy_version": settings.PRIVACY_POLICY_VERSION,
            "account": {
                "id": user.id,
                "email": user.email,
                "username": user.username,
                "provider": user.provider,
                "created_at": user.created_at.isoformat(),
                "privacy_accepted_at": (
                    user.privacy_accepted_at.isoformat()
                    if user.privacy_accepted_at else None
                ),
                "privacy_policy_version": user.privacy_policy_version,
                "terms_accepted_at": (
                    user.terms_accepted_at.isoformat()
                    if user.terms_accepted_at else None
                ),
                "terms_version": user.terms_version,
            },
            "profile": profile,
            "scripts": list(Script.objects.filter(user=user).values()),
            "content_plans": list(ContentPlan.objects.filter(user=user).values()),
            "planned_content": list(
                PlannedContent.objects.filter(content_plan__user=user).values()
            ),
            "analytics_snapshots": list(
                AnalyticsSnapshot.objects.filter(user=user).values()
            ),
            "ai_jobs": list(AIJob.objects.filter(user=user).values()),
            "audit_logs": list(AuditLog.objects.filter(user=user).values()),
            "cookie_consents": list(CookieConsent.objects.filter(user=user).values()),
        }

    @staticmethod
    def erase_user_data(user):
        # Delete the external profile first: the local cascade only runs after
        # the processor confirms deletion, preventing a silent orphan.
        if settings.SUPABASE_URL:
            SupabaseProfileService.delete_profile(user.id)
        user.delete()

    @staticmethod
    def delete_expired_data():
        cutoff = timezone.now() - timedelta(days=settings.DATA_RETENTION_DAYS)
        return {
            "completed_jobs": AIJob.objects.filter(
                status__in=[AIJob.Status.COMPLETED, AIJob.Status.FAILED],
                updated_at__lt=cutoff,
            ).delete()[0],
            "audit_logs": AuditLog.objects.filter(created_at__lt=cutoff).delete()[0],
        }
