from django.core.cache import cache


def get_cached_scripts(user_id: int):
    key = f"scripts:{user_id}"
    return cache.get(key)


def set_cached_scripts(user_id: int, payload):
    key = f"scripts:{user_id}"
    cache.set(key, payload, timeout=300)
