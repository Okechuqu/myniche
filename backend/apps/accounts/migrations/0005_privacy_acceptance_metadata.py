from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("accounts", "0004_user_main_platform")]

    operations = [
        migrations.AddField(
            model_name="user",
            name="privacy_accepted_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="user",
            name="privacy_policy_version",
            field=models.CharField(blank=True, max_length=32),
        ),
    ]
