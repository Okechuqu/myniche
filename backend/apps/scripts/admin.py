from django.contrib import admin

from .models import Script


@admin.register(Script)
class ScriptAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "user_email",
        "niche",
        "platform",
        "created_at",
        "updated_at",
    )
    list_filter = ("platform", "niche", "created_at")
    search_fields = (
        "title",
        "topic",
        "content",
        "user__email",
        "user__username",
    )
    readonly_fields = ("created_at", "updated_at")
    autocomplete_fields = ("user",)
    date_hierarchy = "created_at"
    ordering = ("-created_at",)

    @admin.display(ordering="user__email", description="User")
    def user_email(self, obj):
        return obj.user.email
