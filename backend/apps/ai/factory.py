from decouple import config

from .providers.gemini import (
    GeminiProvider
)

from .providers.openai import (
    OpenAIProvider
)


class AIProviderFactory:

    @staticmethod
    def get_provider():

        provider = config(
            "AI_PROVIDER"
        )

        if provider == "gemini":
            return GeminiProvider()

        if provider == "openai":
            return OpenAIProvider()

        raise Exception(
            "Unknown AI Provider"
        )
