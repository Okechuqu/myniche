def build_daily_topics_prompt(niche: str):
    return f"""Generate 7 fresh content topic suggestions for a creator focused on {niche}, one for each day of the week (Monday through Sunday).

If multiple niches are provided, blend them naturally into one weekly content arc. The topics should feel random, varied, and still progressively build from Monday to Sunday so the week feels like a story.

For each day, provide a single concise topic idea (1 sentence max) that is specific, actionable, and highly relevant to {niche} creators.

Format your response as:
Monday: [topic]
Tuesday: [topic]
Wednesday: [topic]
Thursday: [topic]
Friday: [topic]
Saturday: [topic]
Sunday: [topic]

Make the topics feel distinct from one another while staying connected to the same niche theme."""
