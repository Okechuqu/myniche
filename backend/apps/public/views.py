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
                site_name="ReelsDraft",
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


class TermsOfServiceView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({
            "version": "2026-07-21",
            "title": "Terms of Service",
            "summary": (
                "By using ReelsDraft, you agree to these terms. "
                "The service is provided as-is for personal and commercial content creation. "
                "You are responsible for the content you generate and publish. "
                "We may update these terms; continued use after changes constitutes acceptance."
            ),
            "sections": [
                {
                    "id": "eligibility",
                    "title": "Eligibility",
                    "body": "You must be at least 16 years old or have valid parental/guardian consent to use this service, in accordance with applicable local law.",
                },
                {
                    "id": "accounts",
                    "title": "Accounts",
                    "body": "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.",
                },
                {
                    "id": "content",
                    "title": "Generated content",
                    "body": "AI-generated outputs are provided for your review. You own the outputs you create using the service, subject to our processor agreements with AI providers.",
                },
                {
                    "id": "acceptable-use",
                    "title": "Acceptable use",
                    "body": "You may not use the service for unlawful purposes, to generate harmful content, or to abuse the platform or its providers.",
                },
                {
                    "id": "liability",
                    "title": "Limitation of liability",
                    "body": "To the fullest extent permitted by law, ReelsDraft and its operators shall not be liable for indirect, incidental, or consequential damages arising from use of the service.",
                },
                {
                    "id": "changes",
                    "title": "Changes to terms",
                    "body": "We may revise these terms from time to time. Material changes will be communicated through the service or via email. Continued use after changes means you accept the revised terms.",
                },
                {
                    "id": "contact",
                    "title": "Contact",
                    "body": "For questions about these terms, contact us through the privacy contact channel provided in the service.",
                },
            ],
        })
