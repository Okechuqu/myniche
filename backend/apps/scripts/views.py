from django.shortcuts import render

from rest_framework.views import APIView

from rest_framework.response import Response

from rest_framework.permissions import (
    IsAuthenticated
)

from apps.ai.services.script_generator import (
    ScriptGeneratorService
)

from .serializers import (
    GenerateScriptSerializer
)

from .models import Script

from rest_framework import status
from rest_framework.response import Response

from apps.accounts.services.quota_service import QuotaService


class GenerateScriptView(
    APIView
):

    permission_classes = [
        IsAuthenticated
    ]

    def post(self, request):
        serializer = GenerateScriptSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = (
            serializer.validated_data
        )

        if not QuotaService.can_generate_script(request.user):
            return Response(
                {"detail": "Script quota reached"},
                status=status.HTTP_403_FORBIDDEN,
            )

        result = (
            ScriptGeneratorService
            .generate(
                niche=data["niche"],
                platform=data["platform"],
                topic=data["topic"],
                tone=data["tone"]
            )
        )

        script = Script.objects.create(
            user=request.user,
            title=data["topic"],
            niche=data["niche"],
            platform=data["platform"],
            topic=data["topic"],
            content=result
        )

        return Response({
            "id": script.id,
            "content": result
        })


class ListScriptsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        scripts = Script.objects.filter(user=request.user)

        data = [
            {
                "id": item.id,
                "title": item.title,
                "niche": item.niche,
                "platform": item.platform,
                "topic": item.topic,
                "content": item.content,
                "created_at": item.created_at,
            }
            for item in scripts
        ]

        return Response(data)
