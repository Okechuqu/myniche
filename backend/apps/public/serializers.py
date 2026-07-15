from rest_framework import serializers

from .models import SiteConfiguration, SiteContent


class SiteContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteContent
        fields = [
            "id",
            "title",
            "slug",
            "content_type",
            "summary",
            "body",
            "payload",
            "is_published",
            "sort_order",
            "updated_at",
        ]


class SiteConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteConfiguration
        fields = [
            "id",
            "site_name",
            "site_description",
            "contact_email",
            "contact_phone",
            "favicon_url",
            "seo_title",
            "seo_description",
            "seo_keywords",
            "open_graph_image",
            "canonical_url",
            "updated_at",
        ]
