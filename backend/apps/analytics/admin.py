from django.contrib import admin

from .models import AnalyticsSnapshot


@admin.register(AnalyticsSnapshot)
class AnalyticsSnapshotAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user_email",
        "platform",
        "views",
        "likes",
        "comments",
        "shares",
        "retention_score",
        "created_at",
    )
    list_filter = ("platform", "created_at")
    search_fields = ("platform", "user__email", "user__username")
    readonly_fields = ("created_at",)
    autocomplete_fields = ("user",)
    date_hierarchy = "created_at"
    ordering = ("-created_at",)

    @admin.display(ordering="user__email", description="User")
    def user_email(self, obj):
        return obj.user.email
