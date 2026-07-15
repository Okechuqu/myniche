import re

from apps.ai.factory import (
    AIProviderFactory
)

from apps.ai.prompts.planner_prompt import (
    build_planner_prompt
)

from apps.ai.prompts.daily_topics_prompt import (
    build_daily_topics_prompt
)


class PlannerGeneratorService:

    @staticmethod
    def _normalize_niches(niche: str) -> list[str]:
        if not niche:
            return []

        cleaned = niche.replace("/", ",")
        niches = [part.strip() for part in re.split(
            r"[,;|\n]+", cleaned) if part.strip()]
        return niches

    @staticmethod
    def _build_niche_context(niche: str) -> str:
        niches = PlannerGeneratorService._normalize_niches(niche)
        if not niches:
            return "general creator growth"
        if len(niches) == 1:
            return niches[0]
        if len(niches) == 2:
            return f"{niches[0]} and {niches[1]}"
        return ", ".join(niches[:-1]) + f", and {niches[-1]}"

    @staticmethod
    def generate(
        niche
    ):

        provider = (
            AIProviderFactory
            .get_provider()
        )

        prompt = (
            build_planner_prompt(
                niche
            )
        )

        return (
            provider
            .generate_plan(
                prompt
            )
        )

    @staticmethod
    def generate_daily_topics(niche: str) -> dict:
        """Generate daily topic suggestions for a given niche.

        Returns a dict with day names as keys and topic suggestions as values.
        Example: {"Monday": "Build a ...", "Tuesday": "Share your ...", ...}
        """
        provider = AIProviderFactory.get_provider()
        niche_context = PlannerGeneratorService._build_niche_context(niche)
        prompt = build_daily_topics_prompt(niche_context)

        try:
            response = provider.generate_plan(prompt) or ""
        except Exception:
            response = ""

        days = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ]
        topics = {}

        pattern = re.compile(
            r"^(?:[-*]\s*)?(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s*[:\-–]\s*(.+)$",
            re.IGNORECASE,
        )

        for line in response.splitlines():
            match = pattern.match(line.strip())
            if not match:
                continue

            day = match.group(1).strip().title()
            topic = match.group(2).strip()
            if topic:
                topics[day] = topic

        for day in days:
            if day not in topics:
                topics[day] = f"Create {niche} content for {day}"

        return topics
