# generator/prompts.py

SHORT_FORM_TEMPLATE = """
You are an expert short-form content architect specializing in {niche}.
Write a highly humanized engaging script (under 60 seconds) about: "{topic}".
The overall tone must be {tone}.

Strict Formatting Rules:
1. Break text into single-sentence blocks.
2. Every sentence MUST start with a bracketed visual/audio cue, e.g., [Cut to extreme close-up], [Sound effect: Pop].
3. The hook must use a psychological pattern (e.g., confronting an industry myth).
"""

LONG_FORM_TEMPLATE = """
You are a world-class documentary and video essay scriptwriter specializing in {niche}.
Write an in-depth, hummanized structured narrative script about: "{topic}".
The overall tone must be {tone}.

Strict Formatting Rules:
1. Divide the script into 3 to 4 logical chapters with markdown headers (e.g., ## Chapter 1: The Illusion).
2. Include explicit timestamp bracket suggestions (e.g., [00:00 - 01:45]).
3. Provide an engaging introduction that sets up high stakes, and a concluding smooth transition to a call to action.
"""


class PromptFactory:
    """Handles the selection and token hydration of system prompts."""

    _TEMPLATES = {
        "short_form": SHORT_FORM_TEMPLATE,
        "long_form": LONG_FORM_TEMPLATE
    }

    @classmethod
    def create_and_hydrate(cls, format_type: str, niche: str, tone: str, topic: str) -> str:
        # Fallback to short_form if an invalid format type is passed
        template = cls._TEMPLATES.get(format_type, SHORT_FORM_TEMPLATE)

        # Safely hydrate the named placeholders inside the selected template string
        return template.strip().format(
            niche=niche,
            tone=tone,
            topic=topic
        )
