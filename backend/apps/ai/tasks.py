from celery import shared_task

from apps.jobs.models import AIJob

from apps.ai.services.script_generator import (
    ScriptGeneratorService
)

from apps.scripts.models import Script


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

        job.status = (
            AIJob.Status.COMPLETED
        )

        job.result = {
            "content": result
        }

        job.save()

    except Exception as e:

        job.status = (
            AIJob.Status.FAILED
        )

        job.error_message = str(e)

        job.save()

        raise
