import json
from typing import Any

import requests
from django.conf import settings


class SupabaseProfileService:
    """Minimal Supabase-backed profile service for user profile persistence.

    Expected Supabase table schema:
        create table profiles (
            user_id integer primary key,
            niche text,
            main_platform text,
            creator_goal text,
            avatar text,
            updated_at timestamptz default now()
        );

    In Supabase, enable Row Level Security if you also access this table
    from untrusted clients. The backend uses the service role key for
    trusted server-side access and does not expose profile secrets in the
    Django admin interface.
    """

    BASE_URL = getattr(settings, "SUPABASE_URL", None)
    SERVICE_ROLE_KEY = getattr(settings, "SUPABASE_SERVICE_ROLE_KEY", None)
    ENDPOINT = "/rest/v1/profiles"

    @classmethod
    def _headers(cls) -> dict[str, str]:
        if not cls.SERVICE_ROLE_KEY:
            raise RuntimeError("SUPABASE_SERVICE_ROLE_KEY is not configured")

        return {
            "apikey": cls.SERVICE_ROLE_KEY,
            "Authorization": f"Bearer {cls.SERVICE_ROLE_KEY}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

    @classmethod
    def _request(cls, method: str, path: str, **kwargs: Any) -> requests.Response:
        if not cls.BASE_URL:
            raise RuntimeError("SUPABASE_URL is not configured")

        url = f"{cls.BASE_URL}{path}"
        headers = {**cls._headers(), **kwargs.pop("headers", {})}
        response = requests.request(
            method,
            url,
            headers=headers,
            timeout=10,
            **kwargs,
        )
        response.raise_for_status()
        return response

    @classmethod
    def get_profile(cls, user_id: int) -> dict[str, Any] | None:
        try:
            response = cls._request(
                "GET",
                cls.ENDPOINT,
                params={"select": "*", "user_id": f"eq.{user_id}"},
            )
        except Exception:
            return None

        results = response.json()
        if not isinstance(results, list) or not results:
            return None

        return results[0]

    @classmethod
    def upsert_profile(cls, user_id: int, data: dict[str, Any]) -> dict[str, Any] | None:
        if not data:
            return None

        body = {
            "user_id": user_id,
            **data,
        }

        response = cls._request(
            "POST",
            cls.ENDPOINT,
            params={"on_conflict": "user_id", "return": "representation"},
            data=json.dumps(body),
            headers={**cls._headers(), "Prefer": "return=representation"},
        )

        result = response.json()
        if isinstance(result, list) and result:
            return result[0]

        return None

    @classmethod
    def get_profile_field(cls, user_id: int, field: str) -> Any:
        profile = cls.get_profile(user_id)
        if not profile:
            return None
        return profile.get(field)
