from rest_framework.test import APITestCase


class PublicAuthRouteTests(APITestCase):
    def test_me_requires_auth(self):
        response = self.client.get("/api/accounts/me/")
        self.assertIn(response.status_code, [401, 403])
