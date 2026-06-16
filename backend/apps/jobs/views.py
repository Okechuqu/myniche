from rest_framework.views import APIView

from rest_framework.permissions import (
    IsAuthenticated
)

from rest_framework.response import (
    Response
)

from rest_framework import status

from .models import AIJob

from .serializers import (
    CreateScriptJobSerializer
)

from apps.ai.tasks import (
    generate_script_task
)


class CreateScriptJobView(
    APIView
):

    permission_classes = [
        IsAuthenticated
    ]

    def post(self, request):

        serializer = (
            CreateScriptJobSerializer(
                data=request.data
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        job = AIJob.objects.create(
            user=request.user,
            job_type=AIJob.JobType.SCRIPT,
            payload=serializer.validated_data
        )

        generate_script_task.delay(
            job.id
        )

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

        job = AIJob.objects.get(
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
