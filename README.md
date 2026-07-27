# ReelsDraft

ReelsDraft is an AI-assisted content creation platform combining planning, script generation, and publishing workflows. This repository contains a Django backend and a Next.js frontend.

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
- `DATABASE_URL` - e.g. `postgres://user:pass@db:5432/reelsdraft`
- `REDIS_URL` - e.g. `redis://redis:6379/0`
- `DJANGO_SETTINGS_MODULE` - e.g. `core.settings.development` or `core.settings.production`
- `SUPABASE_URL` - Your Supabase project URL, e.g. `https://xyz123.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key for trusted server-side profile writes
- `PRIVACY_CONTACT_EMAIL` - Contact address shown in privacy communications
- `PRIVACY_POLICY_VERSION`, `TERMS_VERSION`, `COOKIE_POLICY_VERSION` - Version identifiers recorded with acceptance evidence
- `DATA_RETENTION_DAYS` - Retention period for completed jobs and audit records (default: `365`)

Frontend env:

- `NEXT_PUBLIC_API_URL` - Base URL for backend API (e.g. `http://localhost:8000`)
- `NEXT_PUBLIC_SITE_URL` - Canonical public site URL (e.g. `https://reelsdraft.com`)

### Run with Docker Compose (recommended)

1. Copy `.env` files and set values.
2. Build and start services:

```bash
docker compose up --build
```

This starts the backend, Postgres, Redis, a Celery worker, and Celery Beat. The backend container runs migrations and `collectstatic` in the entrypoint. Run the frontend separately with `pnpm dev` unless you add it to the Compose file.

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
pnpm install
pnpm dev
# Build
pnpm build
pnpm start
```

## Backend notes

- The `apps/public` app exposes public content and site configuration endpoints (`/api/public/config/`, `/api/public/contents/`, `/api/public/content/<slug>/`).
- `SiteConfiguration` is intentionally single-instance: admin UI prevents adding a second configuration by default. The API returns the most recently-updated configuration.
- Configure `site_name`, contact details, SEO title/description, canonical URL, Open Graph image, favicon, and optional `twitter_site` in Django admin. These values power social previews for Twitter/X, Facebook, LinkedIn, and other Open Graph-compatible platforms.
- Existing site configurations named `MyNiche` are renamed to `ReelsDraft` by the rebrand migration.

Migrations are managed via Django migrations. After pulling changes run:

```bash
poetry run python manage.py migrate
```

The current privacy/rebrand release includes account-consent, cookie-consent, and public-site metadata migrations. Do not run `makemigrations` in production; only apply committed migrations.

Run tests:

```bash
poetry run python manage.py test
```

## Frontend notes

- The frontend fetches the public config and content for dynamic rendering. Set `NEXT_PUBLIC_API_URL` to point at your backend API.
- Root metadata includes canonical URLs, Open Graph tags, and Twitter/X `summary_large_image` cards. Set `NEXT_PUBLIC_SITE_URL`, then configure the site settings in Django admin to control preview text and imagery.
- The footer displays `contact_email` and `contact_phone` pulled from `/api/public/config/` with sensible fallbacks.

## Privacy and data rights

- Registration records the accepted privacy-policy and terms versions.
- The Settings page provides a portable personal-data export and account deletion.
- Account deletion removes account-linked Django records and the associated Supabase profile when configured.
- Cookie choices are versioned and recorded with their essential-storage purpose.
- Celery Beat schedules retention cleanup; deploy both the `worker` and `beat` services.
- Before production launch, complete the operational GDPR requirements: processor agreements, transfer safeguards, records of processing, backup-retention procedures, and incident-response processes.

## Deployment checklist

- Use a production-ready database (Postgres), configure `DATABASE_URL` securely.
- Set `DEBUG=False` and configure allowed hosts.
- Configure HTTPS termination (TLS) via nginx or a cloud load balancer.
- Use environment secrets (not checked into source).
- Configure logs and monitoring, and ensure `collectstatic` runs during deployment (entrypoint runs it in the Dockerfile included in this repo).

## Security and authentication

- The project uses `dj-rest-auth` and `django-allauth` for auth endpoints. Ensure email backend and site domain are configured for password reset flows.
- Use strong `AUTH_PASSWORD_VALIDATORS` in Django settings for production.

## Contact

- Support email: support@reelsdraft.example
- Support phone: +1 (555) 123-4567
