def build_planner_prompt(
    niche: str
):

    return f"""
Create a 7-day content plan.

Niche:
{niche}

Provide:

Monday
Tuesday
Wednesday
Thursday
Friday
Saturday
Sunday

Include content ideas.
"""
