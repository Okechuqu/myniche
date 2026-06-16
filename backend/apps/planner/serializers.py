from rest_framework import serializers


class GeneratePlanSerializer(serializers.Serializer):
    niche = serializers.CharField()
    platform = serializers.CharField()
    title = serializers.CharField()
    week_start = serializers.DateField()
