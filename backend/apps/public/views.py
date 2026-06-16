from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.throttling import AnonRateThrottle

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
                status=400
            )

        content = ScriptGeneratorService.generate(
            niche=niche,
            platform=platform,
            topic=topic,
            tone=tone
        )

        return Response({
            "script": content
        })
