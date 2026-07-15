from django.test import TestCase

from .models import SiteConfiguration, SiteContent


class SiteContentModelTests(TestCase):
    def test_site_content_can_be_created_with_slug_and_status(self):
        content = SiteContent.objects.create(
            title="Launch Blueprint",
            summary="A public-facing content entry for the marketing experience.",
            body="This content can be managed from the admin dashboard.",
            is_published=True,
            sort_order=1,
        )

        self.assertEqual(content.slug, "launch-blueprint")
        self.assertEqual(str(content), "Launch Blueprint")
        self.assertTrue(content.is_published)


class SiteConfigurationViewTests(TestCase):
    def test_site_configuration_api_returns_latest_configuration(self):
        SiteConfiguration.objects.create(
            site_name="Old Name",
            site_description="Old description",
        )
        new_config = SiteConfiguration.objects.create(
            site_name="New Name",
            site_description="New description",
        )
        new_config.contact_email = "test@example.com"
        new_config.contact_phone = "+1-800-555-0000"
        new_config.save()

        response = self.client.get("/api/public/config/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["site_name"], "New Name")
        self.assertEqual(
            response.json()["site_description"], "New description")
        # ensure contact fields are returned in the API
        self.assertIn("contact_email", response.json())
        self.assertIn("contact_phone", response.json())


class SiteContentApiTests(TestCase):
    def test_site_content_detail_api_returns_published_home_page(self):
        SiteContent.objects.create(
            title="Home Page Content",
            slug="home-page",
            content_type="page",
            payload={"hero": {"title": "Updated Homepage Title"}},
            is_published=True,
            sort_order=1,
        )

        response = self.client.get("/api/public/content/home-page/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["slug"], "home-page")
        self.assertEqual(
            response.json()["payload"]["hero"]["title"],
            "Updated Homepage Title",
        )
