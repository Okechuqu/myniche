from apps.ai.factory import AIProviderFactory
from apps.ai.prompts.planner_prompt import build_planner_prompt


class PlannerGeneratorService:
    @staticmethod
    def generate(niche: str):
        provider = AIProviderFactory.get_provider()
        prompt = build_planner_prompt(niche)
        return provider.generate_plan(prompt)
