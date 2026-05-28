# generator/views.py

from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from openai import OpenAI
from .prompts import PromptFactory


class ScriptGeneratorView(APIView):
    def post(self, request):
        data = request.data

        format_type = data.get("format")
        niche = data.get("niche")
        tone = data.get("tone")
        topic = data.get("topic")

        if not all([niche, topic]):
            return Response(
                {"error": "Niche and Topic fields are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # 1. Dynamically select and hydrate the prompt (No changes needed here!)
            hydrated_system_prompt = PromptFactory.create_and_hydrate(
                format_type=format_type,
                niche=niche,
                tone=tone,
                topic=topic
            )

            api_key = settings.GEMINI_API_KEY or getattr(
                settings, 'OPENAI_API_KEY', None)
            if not api_key:
                return Response(
                    {"error": "Missing OpenAI/Gemini credentials. Set GEMINI_API_KEY or OPENAI_API_KEY."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            # 2. Intercept OpenAI and point it directly to Google AI Studio
            client = OpenAI(
                api_key=api_key,
                base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
            )

            # 3. Call Gemini 2.5 Flash using the standard OpenAI SDK architecture
            response = client.chat.completions.create(
                model="gemini-2.5-flash",
                messages=[
                    {"role": "system", "content": hydrated_system_prompt},
                    {"role": "user", "content": "Generate the script now based on the system rules."}
                ],
                temperature=0.7
            )

            script_output = response.choices[0].message.content

            return Response({"script": script_output}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
