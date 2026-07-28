from .base import *

DEBUG = config("DEBUG", default=False, cast=bool)

ALLOWED_HOSTS = config(
    "ALLOWED_HOSTS",
    default="api.reelsdraft.com"
).split(",")

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

PRODUCTION_FRONTEND_ORIGIN = "https://myniche-six.vercel.app"
PRODUCTION_API_ORIGIN = "https://myniche.onrender.com"

# Keep the deployed frontend allowed even when Render still has an older
# CORS_ALLOWED_ORIGINS value (for example, the local-development default).
CORS_ALLOWED_ORIGINS = list(dict.fromkeys([
    *CORS_ALLOWED_ORIGINS,
    FRONTEND_URL,
    PRODUCTION_FRONTEND_ORIGIN,
]))

CSRF_TRUSTED_ORIGINS = list(dict.fromkeys([
    *csv_setting("CSRF_TRUSTED_ORIGINS"),
    FRONTEND_URL,
    PRODUCTION_FRONTEND_ORIGIN,
    PRODUCTION_API_ORIGIN,
]))
