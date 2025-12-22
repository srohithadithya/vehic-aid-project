# backend/apps/payments/models.py

from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone

from apps.services.models import ServiceRequest

# Assuming these models are correctly defined in the users and services app
from apps.users.models import ServiceBooker, ServiceProvider

CustomUser = get_user_model()


class Transaction(models.Model):
    """
    Records every customer payment for a service.
    """

    STATUS_CHOICES = [
        ("PENDING", "Pending Payment"),
        ("SUCCESS", "Payment Successful"),
        ("FAILED", "Payment Failed"),
        ("REFUNDED", "Refunded"),
    ]
    PAYMENT_METHOD_CHOICES = [
        ("UPI", "UPI"),
        ("CARD", "Card"),
        ("WALLET", "Wallet"),
        ("CASH", "Cash"),
    ]

    # --- Links ---
    service_request = models.OneToOneField(
        ServiceRequest,
        on_delete=models.SET_NULL,
        null=True,
        related_name="transaction",
        help_text="The request this payment fulfills.",
    )
    booker = models.ForeignKey(
        ServiceBooker, on_delete=models.PROTECT, related_name="payments_made"
    )
    provider = models.ForeignKey(
        ServiceProvider, on_delete=models.PROTECT, related_name="payments_received"
    )

    # --- Financial Data ---
    amount = models.DecimalField(
        max_digits=10, decimal_places=2, help_text="Total amount paid by the customer."
    )

    # Corrected field names for commissions/payouts
    platform_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    provider_payout = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    # --- Status and Timestamps ---
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="PENDING")
    payment_method = models.CharField(
        max_length=10,
        choices=PAYMENT_METHOD_CHOICES,
        default="UPI",
        null=True,
        blank=True,
    )  # Added to fix E116 in admin
    created_at = models.DateTimeField(auto_now_add=True)
    settled = models.BooleanField(
        default=False, help_text="True if included in a daily settlement."
    )

    def __str__(self):
        return f"TRX-{self.id} | {self.status} | {self.amount}"


class DailySettlement(models.Model):
    """
    Records the daily aggregated payout made to Service Providers.
    """

    # Renamed 'date' to 'settlement_date' for clarity and to match the admin file
    settlement_date = models.DateField(unique=True)

    # Corrected field names
    total_platform_revenue = models.DecimalField(
        max_digits=12, decimal_places=2, default=0.00
    )
    total_provider_payout_amount = models.DecimalField(
        max_digits=12, decimal_places=2, default=0.00
    )

    transaction_count = models.IntegerField(default=0)
    status = models.CharField(
        max_length=20, default="PROCESSED"
    )  # Added status field to match admin.py
    processed_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Settlement for {self.settlement_date}"


# Alias for backward compatibility
Payment = Transaction
