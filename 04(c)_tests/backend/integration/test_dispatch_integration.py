import pytest
from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse

from apps.users.models import CustomUser, ServiceBooker, ServiceProvider
from apps.services.models import ServiceRequest

@pytest.mark.django_db
class DispatchIntegrationTests(APITestCase):
    
    def setUp(self):
        """Setup: Create a customer, vehicle, and a provider for the request."""
        # Create customer
        self.user = CustomUser.objects.create_user(username='booker', email='booker@vehicaid.in', password='testpassword', is_service_booker=True)
        self.booker = ServiceBooker.objects.create(user=self.user)
        self.vehicle = self.user.vehicles.create(license_plate='MH12ABCD', make='Swift', model='Dzire')
        
        # Create a provider to ensure dispatch succeeds
        self.provider_user = CustomUser.objects.create_user(username='provider', email='provider@vehicaid.in', password='testpassword', is_service_provider=True)
        self.provider = ServiceProvider.objects.create(
            user=self.provider_user, 
            is_verified=True, 
            is_available=True, 
            service_types=['Towing'],
            latitude=18.5,
            longitude=73.8
        )
        
        # Force authentication for the API client
        self.client.force_authenticate(user=self.user)
        self.url = reverse('service-request-create') # Assumes URL name is set

    def test_01_request_creation_and_dispatch_trigger(self):
        """Tests that a service request is created and the dispatch logic assigns a provider."""
        initial_count = ServiceRequest.objects.count()
        
        data = {
            'vehicle_id': self.vehicle.pk,
            'service_type': 'Towing',
            'latitude': 18.500000,
            'longitude': 73.800000,
            'customer_notes': 'Flat tire on highway median'
        }
        
        response = self.client.post(self.url, data, format='json')
        
        # Assertion 1: Check HTTP success status
        assert response.status_code == status.HTTP_201_CREATED
        
        # Assertion 2: Check database record creation
        self.assertEqual(ServiceRequest.objects.count(), initial_count + 1)
        request_obj = ServiceRequest.objects.first()
        
        # Assertion 3: Verify the dispatch logic was triggered and assigned the provider
        self.assertEqual(request_obj.status, 'PROVIDER_EN_ROUTE')
        self.assertEqual(request_obj.provider, self.provider_user)

    def test_02_invalid_vehicle_ownership(self):
        """Tests that a user cannot submit a request using another user's vehicle."""
        # Create a vehicle belonging to a different user (not self.user)
        other_user = CustomUser.objects.create_user(username='other', email='other@a.com', password='p', is_service_booker=True)
        other_vehicle = other_user.vehicles.create(license_plate='KL01XYZ', make='Honda', model='City')
        
        data = {
            'vehicle_id': other_vehicle.pk,
            'service_type': 'Jumpstart',
            'latitude': 18.5,
            'longitude': 73.8
        }
        
        response = self.client.post(self.url, data, format='json')
        
        # Should return a Forbidden status code or a validation error (400)
        assert response.status_code in [status.HTTP_400_BAD_REQUEST, status.HTTP_403_FORBIDDEN]