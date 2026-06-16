from django.contrib import admin
from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
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
    search_fields = ("email", "username")
    list_filter = ("provider", "plan_name", "is_staff", "is_active")
