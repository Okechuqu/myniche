import hashlib
import logging

from django.conf import settings
from django.core.cache import cache
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string


logger = logging.getLogger(__name__)


def _cooldown_key(email):
    email_hash = hashlib.sha256(email.strip().lower().encode()).hexdigest()
    return f"password-reset-email:{email_hash}"


def send_password_reset_email(user, reset_url, token):
    """Send one reset email per address per cooldown window.

    The return value intentionally reveals delivery state only to internal callers.
    The API always returns the same public response to prevent account enumeration.
    """
    cooldown_key = _cooldown_key(user.email)
    if not cache.add(cooldown_key, True, settings.PASSWORD_RESET_COOLDOWN):
        return False

    context = {
        "reset_url": reset_url,
        "username": user.username,
        "expiry_minutes": max(1, settings.PASSWORD_RESET_TIMEOUT // 60),
        "privacy_contact_email": settings.PRIVACY_CONTACT_EMAIL,
    }
    text_body = render_to_string("accounts/email/password_reset.txt", context)
    html_body = render_to_string("accounts/email/password_reset.html", context)
    message = EmailMultiAlternatives(
        subject="Reset your ReelsDraft password",
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
        headers={"Resend-Idempotency-Key": f"password-reset/{user.pk}/{token}"},
    )
    message.attach_alternative(html_body, "text/html")

    try:
        message.send(fail_silently=False)
    except Exception:
        cache.delete(cooldown_key)
        logger.exception("Password reset email delivery failed for user_id=%s", user.pk)
        return False

    return True
