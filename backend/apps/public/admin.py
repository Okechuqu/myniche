from django.contrib import admin

from .models import SiteConfiguration, SiteContent


@admin.register(SiteConfiguration)
class SiteConfigurationAdmin(admin.ModelAdmin):
    list_display = ("site_name", "seo_title", "contact_email",
                    "contact_phone", "updated_at")
    readonly_fields = ("updated_at",)
    actions = None

    def has_add_permission(self, request):
        return not SiteConfiguration.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(SiteContent)
class SiteContentAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "content_type",
        "is_published",
        "sort_order",
        "updated_at",
    )
    list_filter = ("content_type", "is_published", "updated_at")
    search_fields = ("title", "slug", "summary", "body")
    prepopulated_fields = {"slug": ("title",)}
    ordering = ("sort_order", "title")
    readonly_fields = ("created_at", "updated_at")
