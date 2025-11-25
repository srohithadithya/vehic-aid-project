import pytest
from rest_framework import status
from django.test import Client
from django.urls import reverse
from apps.users.models import CustomUser

# Mark the test class to ensure database setup/teardown is handled
@pytest.mark.django_db
class AdminSystemIntegrationTests:
    
    def setup_method(self):
        """Setup standard client and superuser for admin testing."""
        self.client = Client()
        # Create a superuser for accessing the admin panel
        self.admin_user = CustomUser.objects.create_superuser(
            username='admin_test',
            email='admin@vehicaid.com',
            password='testpassword'
        )
        self.login_url = reverse('admin:login')
        self.admin_dashboard_url = reverse('admin:index')

    def test_01_admin_login_success(self):
        """Verifies that the superuser can log into the Django Admin."""
        response = self.client.post(self.login_url, {
            'username': 'admin_test',
            'password': 'testpassword'
        }, follow=True)
        
        # Check if the login was successful (status 200 after redirect)
        assert response.status_code == status.HTTP_200_OK
        # Check if the final URL is the admin dashboard
        assert response.request['PATH_INFO'] == self.admin_dashboard_url

    def test_02_admin_login_failure(self):
        """Verifies that incorrect credentials fail to log in."""
        response = self.client.post(self.login_url, {
            'username': 'admin_test',
            'password': 'wrong_password'
        })
        # Check if login failed (status 200, but redirected back to login page)
        assert response.status_code == status.HTTP_200_OK
        assert 'Please enter the correct username and password' in response.content.decode()

    def test_03_access_custom_model_requires_auth(self):
        """Verifies that accessing a custom admin page (e.g., ServiceRequest) requires login."""
        # Unauthenticated access attempt
        url = reverse('admin:services_servicerequest_changelist')
        response = self.client.get(url, follow=True)
        
        # Should be redirected to the login page
        assert response.status_code == status.HTTP_200_OK
        assert response.request['PATH_INFO'] == self.login_url