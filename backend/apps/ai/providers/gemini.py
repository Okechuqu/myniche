import google.genai as genai

from decouple import config

from .base import BaseAIProvider


class GeminiProvider(BaseAIProvider):
    def __init__(self):
        self.client = genai.Client(
            api_key=config("GEMINI_API_KEY")
        )
        self.model = "gemini-2.5-flash"

    def generate_script(self, prompt: str):
        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
        )
        return response.text

    def generate_plan(self, prompt: str):
        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
        )
        return response.text
