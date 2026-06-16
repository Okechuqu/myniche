from rest_framework.test import APITestCase


class PlannerRouteTests(APITestCase):
    def test_plan_list_requires_auth(self):
        response = self.client.get("/api/planner/")
        self.assertIn(response.status_code, [401, 403])
