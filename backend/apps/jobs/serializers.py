from rest_framework import serializers


class CreateScriptJobSerializer(
    serializers.Serializer
):
    niche = serializers.CharField()

    platform = serializers.CharField()

    topic = serializers.CharField()

    tone = serializers.CharField()


class JobSerializer(
    serializers.Serializer
):
    id = serializers.IntegerField()

    status = serializers.CharField()

    result = serializers.JSONField()

    error_message = serializers.CharField()
