import google.genai as genai

from decouple import config

from .base import BaseAIProvider


class GeminiProvider(
    BaseAIProvider
):

    def __init__(self):

        genai.configure(
            api_key=config(
                "GEMINI_API_KEY"
            )
        )

        self.model = (
            genai.GenerativeModel(
                "gemini-2.5-flash"
            )
        )

    def generate_script(
        self,
        prompt: str
    ):

        response = (
            self.model.generate_content(
                prompt
            )
        )

        return response.text

    def generate_plan(
        self,
        prompt: str
    ):

        response = (
            self.model.generate_content(
                prompt
            )
        )

        return response.text
