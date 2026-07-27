from django.test import TestCase
from rest_framework.test import APIClient

from .models import CookieConsent


class CookieConsentViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_records_versioned_cookie_consent(self):
        response = self.client.post(
            "/api/common/cookie-consent/",
            {"accepted": True, "anonymous_id": "consent-123"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        consent = CookieConsent.objects.get()
        self.assertTrue(consent.accepted)
        self.assertEqual(consent.purposes, ["essential_storage"])
        self.assertEqual(consent.anonymous_id, "consent-123")

    def test_rejects_non_boolean_cookie_consent(self):
        response = self.client.post(
            "/api/common/cookie-consent/",
            {"accepted": "false"},
            format="json",
        )

        self.assertEqual(response.status_code, 400)

# Create your tests here.
