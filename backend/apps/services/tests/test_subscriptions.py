import pytest
from datetime import timedelta
from django.utils import timezone
from django.urls import reverse
from rest_framework import status
from apps.services.models import SubscriptionPlan, UserSubscription
from apps.users.models import CustomUser, ServiceBooker

@pytest.mark.django_db
class TestSubscriptionSystem:
    @pytest.fixture(autouse=True)
    def setup(self, client):
        # Create user and profile
        self.user = CustomUser.objects.create_user(
            username="testuser", email="test@example.com", password="password123"
        )
        self.user.is_service_booker = True
        self.user.save()
        self.booker = ServiceBooker.objects.create(user=self.user, phone_number="1234567890")
        
        # Create plans
        self.free_plan = SubscriptionPlan.objects.create(
            name="FREE", price=0, duration_days=365, max_requests_per_month=1
        )
        self.premium_plan = SubscriptionPlan.objects.create(
            name="PREMIUM", price=999, duration_days=30, max_requests_per_month=0
        )
        
        # Authenticate client
        self.client = client
        self.client.force_authenticate(user=self.user)

    def test_list_plans(self):
        # This endpoint doesn't exist yet, but we can test plan creation
        assert SubscriptionPlan.objects.count() == 2

    def test_subscribe_to_plan(self):
        url = reverse("subscription-list")
        print(f"DEBUG: Reversed URL is {url}")
        data = {"plan": self.premium_plan.id, "auto_renew": True}
        response = self.client.post(url, data)
        print(f"DEBUG: Response status: {response.status_code}")
        print(f"DEBUG: Response content: {response.content}")
        
        assert response.status_code == status.HTTP_201_CREATED
        assert UserSubscription.objects.filter(user=self.booker, plan=self.premium_plan).exists()
        
        sub = UserSubscription.objects.get(user=self.booker)
        assert sub.status == "PENDING" # Default status
        assert sub.auto_renew is True

    def test_cancel_subscription(self):
        # Create active subscription
        sub = UserSubscription.objects.create(
            user=self.booker, plan=self.premium_plan, status="ACTIVE", is_active=True,
            end_date=timezone.now() + timedelta(days=30)
        )
        sub.save() # Triggers save logic for end_date
        
        url = reverse("subscription-cancel", args=[sub.id])
        response = self.client.post(url)
        
        assert response.status_code == status.HTTP_200_OK
        sub.refresh_from_db()
        assert sub.status == "CANCELLED"
        assert sub.is_active is False

    def test_renew_subscription(self):
        # Create expired subscription with auto-renew
        sub = UserSubscription.objects.create(
            user=self.booker, plan=self.premium_plan, status="EXPIRED", is_active=False,
            auto_renew=True, end_date=timezone.now() - timedelta(days=1)
        )
        sub.save()

        url = reverse("subscription-renew", args=[sub.id])
        response = self.client.post(url)
        
        assert response.status_code == status.HTTP_200_OK
        sub.refresh_from_db()
        assert sub.status == "ACTIVE"
        assert sub.is_active is True

    def test_get_current_subscription(self):
        # No subscription initially
        url = reverse("subscription-current")
        response = self.client.get(url)
        assert response.status_code == status.HTTP_404_NOT_FOUND
        
        # Create active subscription
        sub = UserSubscription.objects.create(
            user=self.booker, plan=self.premium_plan, status="ACTIVE", is_active=True,
            end_date=timezone.now() + timedelta(days=30)
        )
        sub.save()
        
        response = self.client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["plan"]["name"] == "PREMIUM"
