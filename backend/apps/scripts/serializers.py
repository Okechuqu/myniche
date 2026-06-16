from rest_framework import serializers


class GenerateScriptSerializer(
    serializers.Serializer
):

    niche = serializers.CharField()

    platform = serializers.CharField()

    topic = serializers.CharField()

    tone = serializers.CharField()
