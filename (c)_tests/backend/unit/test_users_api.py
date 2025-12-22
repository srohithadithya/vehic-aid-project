# tests/backend/unit/test_users_api.py

import pytest
from rest_framework import status
from django.test import TestCase
from django.urls import reverse
from apps.users.models import CustomUser

@pytest.mark.django_db
class UserRegistrationTests(TestCase):
    def test_booker_registration_success(self):
        """Tests successful creation of a Service Booker account."""
        url = reverse('register-booker')
        data = {
            'username': 'testbooker',
            'email': 'booker@vehicaid.in',
            'phone_number': '9876543210',
            'password': 'StrongPassword123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(CustomUser.objects.filter(username='testbooker').exists())
        self.assertTrue(CustomUser.objects.get(username='testbooker').is_service_booker)

    def test_provider_registration_pending(self):
        """Tests provider registration (should be unverified initially)."""
        url = reverse('register-provider')
        data = {
            'username': 'testprovider',
            'email': 'provider@service.com',
            'phone_number': '9988776655',
            'password': 'SecurePassword456',
            'bank_account_number': '1234567890',
            'bank_ifsc_code': 'HDFC0000123',
            'service_types': ['Towing', 'Jumpstart']
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        provider = CustomUser.objects.get(username='testprovider').serviceprovider
        self.assertFalse(provider.is_verified) # Must be False for admin review