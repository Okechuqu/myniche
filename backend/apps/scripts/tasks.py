from celery import shared_task

from .models import Script


@shared_task
def cleanup_empty_scripts():
    Script.objects.filter(content="").delete()
