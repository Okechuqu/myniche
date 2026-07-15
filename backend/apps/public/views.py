from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.throttling import AnonRateThrottle

from .models import SiteConfiguration, SiteContent
from .serializers import SiteConfigurationSerializer, SiteContentSerializer
from apps.ai.services.script_generator import ScriptGeneratorService


class PublicDemoThrottle(AnonRateThrottle):
    rate = "10/hour"


class PublicDemoGenerateView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [PublicDemoThrottle]

    def post(self, request):
        niche = request.data.get("niche", "")
        platform = request.data.get("platform", "")
        topic = request.data.get("topic", "")
        tone = request.data.get("tone", "")

        if not niche or not platform or not topic or not tone:
            return Response(
                {"error": "Missing fields"},
                status=400,
            )

        content = ScriptGeneratorService.generate(
            niche=niche,
            platform=platform,
            topic=topic,
            tone=tone,
        )

        return Response({"script": content})


class SiteConfigurationView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        config = SiteConfiguration.objects.order_by("-updated_at").first()
        if not config:
            config = SiteConfiguration.objects.create(
                site_name="MyNiche",
                site_description="AI Creator Operating System",
            )
        serializer = SiteConfigurationSerializer(config)
        return Response(serializer.data)


class SiteContentListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = SiteContentSerializer

    def get_queryset(self):
        queryset = SiteContent.objects.filter(is_published=True)
        content_type = self.request.query_params.get("type")
        slug = self.request.query_params.get("slug")

        if content_type:
            queryset = queryset.filter(content_type=content_type)

        if slug:
            slugs = [item.strip() for item in slug.split(",") if item.strip()]
            queryset = queryset.filter(slug__in=slugs)

        return queryset.order_by("sort_order", "title")


class SiteContentDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = SiteContentSerializer
    queryset = SiteContent.objects.filter(is_published=True)
    lookup_field = "slug"
