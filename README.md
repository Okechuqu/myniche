# MyNiche

MyNiche is an AI-assisted content creation platform combining planning, script generation, and publishing workflows. This repository contains a Django backend and a Next.js frontend.

## Repository layout

- `backend/` - Django project and apps (public content, accounts, AI services, etc.)
- `frontend/` - Next.js (App Router) TypeScript frontend

## Tech stack

- Backend: Python 3.12, Django 6.x, Django Rest Framework, dj-rest-auth, django-allauth
- Frontend: Next.js 13+, TypeScript, React
- Deployment: Docker, gunicorn, nginx, Postgres, Redis
- Tooling: Poetry (Python) and pnpm (JS)

## Quick start (local development)

Prerequisites:

- Docker & Docker Compose (recommended)
- Poetry (backend) or Python 3.12+ and pip
- Node 18+ and pnpm

### Environment

Copy environment files (example):

- `backend/.env` (or set environment variables directly)
- `frontend/.env.local` (for local Next.js env vars)

Important environment variables (backend):

- `SECRET_KEY` - Django secret
- `DEBUG` - `True`/`False`
- `DATABASE_URL` - e.g. `postgres://user:pass@db:5432/myniche`
- `REDIS_URL` - e.g. `redis://redis:6379/0`
- `DJANGO_SETTINGS_MODULE` - e.g. `core.settings.development` or `core.settings.production`
- `SUPABASE_URL` - Your Supabase project URL, e.g. `https://xyz123.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key for trusted server-side profile writes

Frontend env:

- `NEXT_PUBLIC_API_URL` - Base URL for backend API (e.g. `http://localhost:8000`)

### Run with Docker Compose (recommended)

1. Copy `.env` files and set values.
2. Build and start services:

```bash
docker compose up --build
```

This starts the backend, Postgres, Redis, and frontend (if configured). The backend container runs migrations and `collectstatic` in the entrypoint.

### Run locally without Docker

Backend:

```bash
# from backend/
poetry install
poetry shell
cp .env.example .env   # or create .env
poetry run python manage.py migrate
poetry run python manage.py createsuperuser
poetry run python manage.py runserver
```

Frontend:

```bash
# from frontend/
pmpn install
pnpm dev
# Build
pnpm build
pnpm start
```

## Backend notes

- The `apps/public` app exposes public content and site configuration endpoints (`/api/public/config/`, `/api/public/contents/`, `/api/public/content/<slug>/`).
- `SiteConfiguration` is intentionally single-instance: admin UI prevents adding a second configuration by default. The API returns the most recently-updated configuration.
- Contact fields were added: `contact_email` and `contact_phone`. These are editable from the Django admin and exposed by the API.

Migrations are managed via Django migrations. After pulling changes run:

```bash
poetry run python manage.py makemigrations
poetry run python manage.py migrate
```

Run tests:

```bash
poetry run python manage.py test
```

## Frontend notes

- The frontend fetches the public config and content for dynamic rendering. Set `NEXT_PUBLIC_API_URL` to point at your backend API.
- The footer displays `contact_email` and `contact_phone` pulled from `/api/public/config/` with sensible fallbacks.

## Deployment checklist

- Use a production-ready database (Postgres), configure `DATABASE_URL` securely.
- Set `DEBUG=False` and configure allowed hosts.
- Configure HTTPS termination (TLS) via nginx or a cloud load balancer.
- Use environment secrets (not checked into source).
- Configure logs and monitoring, and ensure `collectstatic` runs during deployment (entrypoint runs it in the Dockerfile included in this repo).

## Security and authentication

- The project uses `dj-rest-auth` and `django-allauth` for auth endpoints. Ensure email backend and site domain are configured for password reset flows.
- Use strong `AUTH_PASSWORD_VALIDATORS` in Django settings for production.

## Change-password (password change/reset) review & recommendations

Summary: the project currently uses standard endpoints from dj-rest-auth/allauth for the authenticated password change and the password reset flow. The password reset flow sends email tokens and relies on Django email backend. To harden and improve UX/security, consider the following:

- Require the current password on the authenticated password-change endpoint (prevent accidental changes if session compromised). This is the default `PasswordChangeForm` behaviour; confirm the API and frontend require `old_password`.
- Enforce strong password validators in `settings.py` (min length, common password checks, numeric checks). Example values: `MinimumLengthValidator`, `CommonPasswordValidator`, `NumericPasswordValidator`.
- Rate-limit password-reset and demo/generate endpoints (the repo already uses throttling for demo generation). Add throttling on `password/reset/` to avoid abuse.
- Set short expiry for password reset tokens and ensure tokens are single-use. Configure `PASSWORD_RESET_TIMEOUT` (seconds) if needed.
- Audit logging: log password-reset request events (not the new password itself) with timestamp and IP to detect suspicious activity.
- Optional: Add a password-history check to prevent reuse of recent passwords (third-party packages available).
- Optional: Add CAPTCHA on unauthenticated reset request forms to reduce automated abuse.
- Optional: Offer MFA/2FA for additional account protection.
- Ensure email templates are clear about next steps and do not leak any sensitive information.

Concrete developer checklist:

- Confirm `dj-rest-auth` endpoints used in frontend; ensure the change-password form sends `old_password` and `new_password1/new_password2` to the correct endpoint.
- Add or confirm `DEFAULT_THROTTLE_RATES` for password reset in `settings.py`.
- Enable `AUTH_PASSWORD_VALIDATORS` for production.
- Add server-side logging of password reset requests (timestamp, user/email, IP)
- Consider implementing 2FA as opt-in (e.g., using django-two-factor-auth)

## Contact

- Support email: support@myniche.example
- Support phone: +1 (555) 123-4567

If you'd like, I can also:

- Add `.env.example` files for backend and frontend with recommended variables.
- Add CI workflows for running tests and building the frontend.
- Implement rate-limiting for password reset endpoints and add server-side audit logs.

---

Generated and updated by GitHub Copilot (GPT-5 mini) during this session.
