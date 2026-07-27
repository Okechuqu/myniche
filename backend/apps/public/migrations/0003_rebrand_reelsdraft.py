from django.db import migrations, models


def rename_default_site_configuration(apps, schema_editor):
    SiteConfiguration = apps.get_model("public", "SiteConfiguration")
    SiteConfiguration.objects.filter(site_name="MyNiche").update(
        site_name="ReelsDraft"
    )


class Migration(migrations.Migration):
    dependencies = [("public", "0002_alter_siteconfiguration_options_and_more")]

    operations = [
        migrations.AlterField(
            model_name="siteconfiguration",
            name="site_name",
            field=models.CharField(default="ReelsDraft", max_length=255),
        ),
        migrations.RunPython(rename_default_site_configuration, migrations.RunPython.noop),
    ]
