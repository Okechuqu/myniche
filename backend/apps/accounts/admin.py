from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    list_display = (
        "id",
        "email",
        "username",
        "provider",
        "plan_name",
        "script_quota",
        "is_staff",
        "created_at",
    )
    list_select_related = ()
    search_fields = (
        "email",
        "username",
        "niche",
        "main_platform",
        "creator_goal",
    )
    list_filter = ("provider", "plan_name", "is_staff", "is_active")
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "last_login", "date_joined")
    fieldsets = DjangoUserAdmin.fieldsets + (
        (
            "Creator profile",
            {
                "fields": (
                    "niche",
                    "main_platform",
                    "creator_goal",
                    "avatar",
                    "plan_name",
                    "script_quota",
                )
            },
        ),
        (
            "Authentication provider",
            {
                "classes": ("collapse",),
                "fields": ("provider", "google_sub"),
            },
        ),
    )
    add_fieldsets = DjangoUserAdmin.add_fieldsets + (
        (
            "Creator profile",
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "niche",
                    "main_platform",
                    "creator_goal",
                    "plan_name",
                ),
            },
        ),
    )
