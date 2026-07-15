from rest_framework.views import APIView

from rest_framework.permissions import (
    IsAuthenticated
)

from rest_framework.response import (
    Response
)

from rest_framework import status

from django.shortcuts import get_object_or_404

from .models import AIJob

from .serializers import (
    CreateScriptJobSerializer
)

from apps.ai.tasks import (
    generate_script_task
)

from apps.accounts.services.quota_service import QuotaService

from core.celery import app as celery_app


class CreateScriptJobView(
    APIView
):

    permission_classes = [
        IsAuthenticated
    ]

    def post(self, request):

        if not QuotaService.can_generate_script(request.user):
            return Response(
                {"detail": "Script quota reached"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = (
            CreateScriptJobSerializer(
                data=request.data
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        payload = serializer.validated_data
        count = payload.get("count", 2)

        if not QuotaService.can_generate_scripts(request.user, count):
            return Response(
                {"detail": "Script quota reached"},
                status=status.HTTP_403_FORBIDDEN,
            )

        job = AIJob.objects.create(
            user=request.user,
            job_type=AIJob.JobType.SCRIPT,
            payload=payload
        )

        # Try to dispatch asynchronously. If there are no running workers
        # (ping returns empty/None) fall back to executing synchronously so
        # the user doesn't get stuck with a permanently pending job.
        try:
            result = generate_script_task.delay(job.id)

            # If Celery workers are not available, inspect().ping() returns None
            # or an empty dict. In that case, run task synchronously.
            try:
                inspector = celery_app.control.inspect(timeout=1)
                ping = inspector.ping()
            except Exception:
                ping = None

            if not ping:
                # run the task synchronously (call the underlying function)
                generate_script_task.run(job.id)
        except Exception:
            # As a last resort, execute synchronously to guarantee progress
            try:
                generate_script_task.run(job.id)
            except Exception:
                # If synchronous execution also fails, leave the job pending
                # and return the accepted response so client can handle retries.
                pass

        return Response(
            {
                "job_id": job.id,
                "status": job.status
            },
            status=status.HTTP_202_ACCEPTED
        )


class JobDetailView(
    APIView
):

    permission_classes = [
        IsAuthenticated
    ]

    def get(
        self,
        request,
        job_id
    ):

        job = get_object_or_404(
            AIJob,
            id=job_id,
            user=request.user
        )

        return Response(
            {
                "id": job.id,
                "status": job.status,
                "result": job.result,
                "error": job.error_message,
                "created_at": job.created_at,
            }
        )
