from openai import OpenAI

from decouple import config

from .base import BaseAIProvider


class OpenAIProvider(
    BaseAIProvider
):

    def __init__(self):

        self.client = OpenAI(
            api_key=config(
                "OPENAI_API_KEY"
            )
        )

    def generate_script(
        self,
        prompt: str
    ):

        response = (
            self.client.responses.create(
                model="gpt-5",
                input=prompt
            )
        )

        return response.output_text

    def generate_plan(
        self,
        prompt: str
    ):

        response = (
            self.client.responses.create(
                model="gpt-5",
                input=prompt
            )
        )

        return response.output_text
