def build_script_prompt(
    niche: str,
    platform: str,
    topic: str,
    tone: str
):

    return f"""
You are an expert content strategist.

Create a viral content script.

Niche:
{niche}

Platform:
{platform}

Topic:
{topic}

Tone:
{tone}

Return:

HOOK:

BODY:

CTA:
"""
