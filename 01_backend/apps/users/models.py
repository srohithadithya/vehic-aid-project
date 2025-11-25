from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

# --- Custom User Model ---


class CustomUser(AbstractUser):
    """
    Base user model using phone number/email for login.
    """

    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True)

    # We will use 'username' only for the admin panel, primarily using phone for login
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    # Custom roles based on user type
    is_service_booker = models.BooleanField(
        default=True, help_text="Designates this user as a customer."
    )
    is_service_provider = models.BooleanField(
        default=False,
        help_text="Designates this user as a professional service provider.",
    )

    def __str__(self):
        return self.email or self.username


# --- Profile Models (One-to-One with CustomUser) ---


class ServiceBooker(models.Model):
    """Profile data specific to the customer (Service Booker)."""

    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)
    preferred_language = models.CharField(max_length=5, default="en-in")
    # Linked to IoT device in iot_devices/models.py

    def __str__(self):
        return f"Booker: {self.user.username}"


class ServiceProvider(models.Model):
    """Profile data specific to the professional (Service Provider)."""

    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)

    # Verification Status (Crucial for compliance and quality)
    is_verified = models.BooleanField(
        default=False, help_text="True after admin verifies documents and background."
    )
    is_available = models.BooleanField(
        default=False, help_text="Provider toggle for receiving jobs."
    )

    # Banking/Payout Details (for automatic daily settlements)
    bank_account_number = models.CharField(max_length=20, blank=True, null=True)
    bank_ifsc_code = models.CharField(max_length=15, blank=True, null=True)

    # Operational Details
    service_types = models.JSONField(
        default=list,
        help_text="List of services provider is qualified for (e.g., 'Towing', 'Jumpstart').",
    )
    latitude = models.DecimalField(
        max_digits=10, decimal_places=8, null=True, blank=True
    )
    longitude = models.DecimalField(
        max_digits=10, decimal_places=8, null=True, blank=True
    )

    # Performance Metrics
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    jobs_completed = models.IntegerField(default=0)

    def __str__(self):
        return f"Provider: {self.user.username} ({'Verified' if self.is_verified else 'Unverified'})"
