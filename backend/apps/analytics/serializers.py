from rest_framework import serializers


class AnalyticsSnapshotSerializer(serializers.Serializer):
    platform = serializers.CharField()
    views = serializers.IntegerField(min_value=0)
    likes = serializers.IntegerField(min_value=0)
    comments = serializers.IntegerField(min_value=0)
    shares = serializers.IntegerField(min_value=0)
    retention_score = serializers.DecimalField(
        max_digits=5,
        decimal_places=2,
    )
