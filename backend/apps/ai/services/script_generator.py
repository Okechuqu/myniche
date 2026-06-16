from apps.ai.factory import (
    AIProviderFactory
)

from apps.ai.prompts.script_prompt import (
    build_script_prompt
)


class ScriptGeneratorService:

    @staticmethod
    def generate(
        niche,
        platform,
        topic,
        tone
    ):

        provider = (
            AIProviderFactory
            .get_provider()
        )

        prompt = (
            build_script_prompt(
                niche,
                platform,
                topic,
                tone
            )
        )

        return (
            provider
            .generate_script(
                prompt
            )
        )
