from celery import shared_task

from apps.jobs.models import AIJob

from apps.ai.services.script_generator import (
    ScriptGeneratorService
)

from apps.planner.models import PlannedContent
from apps.scripts.models import Script
from django.db.models import Q
from django.utils import timezone
from datetime import timedelta


def _attach_script_to_current_weekly_item(user, topic, content, generated_title=None, generated_variant=None):
    today = timezone.localdate()
    week_start = today - timedelta(days=today.weekday())
    current_day_name = today.strftime("%A")

    planned_item = (
        PlannedContent.objects
        .filter(
            content_plan__user=user,
            content_plan__week_start=week_start,
            script="",
        )
        .filter(
            Q(topic=topic) | Q(day_name=current_day_name)
        )
        .order_by("id")
        .first()
    )

    if planned_item:
        planned_item.script = content
        if generated_title is not None:
            planned_item.generated_title = generated_title
        if generated_variant is not None:
            planned_item.generated_variant = generated_variant
        planned_item.save(
            update_fields=["script", "generated_title", "generated_variant"])


@shared_task(
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_kwargs={"max_retries": 3},
)
def generate_script_task(
    job_id
):

    job = AIJob.objects.get(
        id=job_id
    )

    job.status = (
        AIJob.Status.PROCESSING
    )

    job.save()

    try:

        payload = job.payload
        script_count = payload.get("count", 2)
        generated_scripts = []

        for index in range(script_count):
            result = (
                ScriptGeneratorService
                .generate(
                    niche=payload["niche"],
                    platform=payload["platform"],
                    topic=payload["topic"],
                    tone=payload["tone"]
                )
            )

            Script.objects.create(
                user=job.user,
                title=payload["topic"],
                niche=payload["niche"],
                platform=payload["platform"],
                topic=payload["topic"],
                content=result
            )

            if index == 0:
                _attach_script_to_current_weekly_item(
                    job.user,
                    payload["topic"],
                    result,
                    generated_title=f"{payload['topic']} • {payload['platform']}",
                    generated_variant=f"Variant {index + 1}",
                )

            generated_scripts.append({"content": result})

        job.status = (
            AIJob.Status.COMPLETED
        )

        job.result = {
            "content": generated_scripts[0]["content"] if len(generated_scripts) == 1 else None,
            "scripts": generated_scripts,
        }

        job.save()

    except Exception as e:

        job.status = (
            AIJob.Status.FAILED
        )

        job.error_message = str(e)

        job.save()

        raise
