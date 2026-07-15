from django.conf import settings
from django.http import JsonResponse, HttpResponse

from .models import AuditLog


class MaintenanceMiddleware:
    """Return a maintenance response when MAINTENANCE_MODE is enabled.

    Staff users and safe endpoints (static, media, admin, health) are allowed.
    API requests receive a JSON 503 response; regular pages receive a simple HTML 503.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        maintenance_enabled = False
        # Priority: DB flag if available, otherwise fallback to settings
        try:
            from .models import MaintenanceFlag

            flag = MaintenanceFlag.objects.first()
            if flag:
                maintenance_enabled = bool(flag.enabled)
        except Exception:
            # ignore DB errors during migrations or setup
            maintenance_enabled = False

        if not maintenance_enabled:
            # fallback to settings value
            maintenance_enabled = getattr(settings, "MAINTENANCE_MODE", False)

        if maintenance_enabled:
            # allow staff and superusers
            user = getattr(request, "user", None)
            if user and getattr(user, "is_staff", False):
                return self.get_response(request)

            # allow some safe paths
            allowed_prefixes = [
                "/static/",
                settings.STATIC_URL or "/static/",
                settings.MEDIA_URL or "/media/",
                "/admin",
                "/health",
            ]

            for prefix in allowed_prefixes:
                if prefix and request.path.startswith(prefix):
                    return self.get_response(request)

            if request.path.startswith("/api/"):
                return JsonResponse(
                    {"detail": "Service temporarily unavailable due to maintenance."},
                    status=503,
                )

            # simple HTML response for frontend routes
            content = (
                "<html><head><title>Maintenance</title></head>"
                "<body style='background:#0f172a;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;'>"
                "<div style='max-width:640px;padding:2rem;text-align:center;'>"
                "<h1 style='font-size:32px;margin-bottom:0.5rem'>We'll be back soon</h1>"
                "<p style='color:#9ca3af;margin-bottom:1rem'>We're performing scheduled maintenance. Thanks for your patience.</p>"
                "</div></body></html>"
            )
            return HttpResponse(content, status=503)

        return self.get_response(request)


class AuditMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        if request.user.is_authenticated:
            user = request.user if request.user.pk else None
            AuditLog.objects.create(
                user=user,
                action=request.method,
                entity=request.path,
                metadata={
                    "status_code": response.status_code,
                },
            )

        return response
