from django.contrib import admin

from .models import AIJob


@admin.register(AIJob)
class AIJobAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user_email",
        "job_type",
        "status",
        "created_at",
        "updated_at",
    )
    list_filter = ("job_type", "status", "created_at", "updated_at")
    search_fields = ("user__email", "user__username", "error_message")
    readonly_fields = ("created_at", "updated_at")
    autocomplete_fields = ("user",)
    date_hierarchy = "created_at"
    ordering = ("-created_at",)

    @admin.display(ordering="user__email", description="User")
    def user_email(self, obj):
        return obj.user.email
