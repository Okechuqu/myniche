from django.contrib import admin

from .models import ContentPlan, PlannedContent


class PlannedContentInline(admin.TabularInline):
    model = PlannedContent
    extra = 0
    fields = ("day_name", "topic", "status", "script", "created_at")
    readonly_fields = ("created_at",)
    show_change_link = True


@admin.register(ContentPlan)
class ContentPlanAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "user_email",
        "niche",
        "platform",
        "week_start",
        "created_at",
        "item_count",
    )
    list_filter = ("platform", "niche", "week_start", "created_at")
    search_fields = ("title", "niche", "user__email", "user__username")
    readonly_fields = ("created_at",)
    autocomplete_fields = ("user",)
    date_hierarchy = "week_start"
    ordering = ("-week_start", "-created_at")
    inlines = (PlannedContentInline,)

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related("items")

    @admin.display(ordering="user__email", description="User")
    def user_email(self, obj):
        return obj.user.email

    @admin.display(description="Items")
    def item_count(self, obj):
        return obj.items.count()


@admin.register(PlannedContent)
class PlannedContentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "topic",
        "plan_title",
        "day_name",
        "status",
        "created_at",
    )
    list_filter = ("status", "day_name", "created_at")
    search_fields = (
        "topic",
        "script",
        "content_plan__title",
        "content_plan__user__email",
    )
    readonly_fields = ("created_at",)
    autocomplete_fields = ("content_plan",)
    ordering = ("content_plan", "day_name")

    @admin.display(ordering="content_plan__title", description="Plan")
    def plan_title(self, obj):
        return obj.content_plan.title
