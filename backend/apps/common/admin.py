from django.contrib import admin

from .models import AuditLog


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("id", "user_email", "action", "entity", "created_at")
    list_filter = ("action", "entity", "created_at")
    search_fields = ("user__email", "user__username", "action", "entity")
    readonly_fields = ("user", "action", "entity", "metadata", "created_at")
    date_hierarchy = "created_at"
    ordering = ("-created_at",)

    def has_add_permission(self, request):
        return False

    @admin.display(ordering="user__email", description="User")
    def user_email(self, obj):
        return obj.user.email if obj.user_id else "System"
