from django.shortcuts import render
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseForbidden
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import user_passes_test
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
import json

from .models import MaintenanceFlag, CookieConsent


def health(request):
    return JsonResponse({"status": "ok"})


# Create your views here.


@require_POST
@user_passes_test(lambda u: u.is_staff)
def toggle_maintenance(request):
    """Toggle or set maintenance mode. POST JSON {"enabled": true, "message": "optional"}

    Only staff users can call this endpoint.
    """
    try:
        payload = json.loads(request.body.decode("utf-8") or "{}")
    except Exception:
        return HttpResponseBadRequest("Invalid JSON")

    enabled = payload.get("enabled")
    message = payload.get("message", "")

    flag = MaintenanceFlag.objects.first()
    if not flag:
        flag = MaintenanceFlag.objects.create(enabled=bool(
            enabled) if enabled is not None else True, message=message)
    else:
        if enabled is not None:
            flag.enabled = bool(enabled)
        if message is not None:
            flag.message = message
        flag.save()

    return JsonResponse({"enabled": flag.enabled, "message": flag.message})


@api_view(["POST"])
@permission_classes([AllowAny])
def record_cookie_consent(request):
    try:
        payload = json.loads(request.body.decode("utf-8") or "{}")
    except Exception:
        return HttpResponseBadRequest("Invalid JSON")

    accepted = payload.get("accepted")
    if not isinstance(accepted, bool):
        return HttpResponseBadRequest("Missing accepted flag")

    anonymous_id = payload.get("anonymous_id", "")
    if not isinstance(anonymous_id, str) or len(anonymous_id) > 64:
        return HttpResponseBadRequest("Invalid consent identifier")

    user = request.user if request.user.is_authenticated else None
    CookieConsent.objects.create(
        user=user,
        accepted=accepted,
        policy_version=settings.COOKIE_POLICY_VERSION,
        purposes=["essential_storage"],
        anonymous_id=anonymous_id,
    )

    return JsonResponse({"recorded": True})
