from rest_framework.test import APITestCase


class ScriptRouteTests(APITestCase):
    def test_script_list_requires_auth(self):
        response = self.client.get("/api/scripts/")
        self.assertIn(response.status_code, [401, 403])
