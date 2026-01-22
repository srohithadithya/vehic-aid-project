# backend/apps/services/models.py

from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone
from decimal import Decimal

# Get the CustomUser model defined in the users app
CustomUser = get_user_model()


class SubscriptionPlan(models.Model):
    """Defines the various tiers of service plans (Free, Premium, IoT+Subscription)."""

    PLAN_CHOICES = [
        ("FREE", "Free Access"),
        ("BASIC", "Basic Plan"),
        ("PREMIUM", "Premium Plan"),
        ("ELITE", "Elite Plan"),
    ]

    name = models.CharField(max_length=50, choices=PLAN_CHOICES, unique=True)
    price = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    duration_days = models.IntegerField(default=45)
    is_exchange_eligible = models.BooleanField(default=False)
    description = models.TextField(blank=True, null=True)
    features = models.JSONField(
        default=list, help_text="List of features included in this plan"
    )
    # The DB column created by older migrations is `max_requests_per_month`.
    # Keep the model field name `max_requests` (used in tests) but map it to the
    # existing DB column using db_column so migrations stay compatible.
    max_requests = models.IntegerField(
        default=0, help_text="0 means unlimited", db_column="max_requests_per_month"
    )

    def __str__(self):
        return self.get_name_display()

    class Meta:
        verbose_name = "Subscription Plan"
        verbose_name_plural = "Subscription Plans"

    def __init__(self, *args, **kwargs):
        # Accept legacy constructor kwarg 'max_requests_per_month' used by tests
        if "max_requests_per_month" in kwargs and "max_requests" not in kwargs:
            kwargs["max_requests"] = kwargs.pop("max_requests_per_month")
        super().__init__(*args, **kwargs)


class UserSubscription(models.Model):
    """Tracks active subscriptions for Service Bookers."""

    STATUS_CHOICES = [
        ("ACTIVE", "Active"),
        ("EXPIRED", "Expired"),
        ("CANCELLED", "Cancelled"),
        ("PENDING", "Pending Payment"),
    ]

    user = models.ForeignKey(
        "users.ServiceBooker",
        on_delete=models.CASCADE,
        related_name="subscriptions",
    )
    plan = models.ForeignKey(
        SubscriptionPlan, on_delete=models.PROTECT, related_name="subscriptions"
    )
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    auto_renew = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="ACTIVE")
    payment_transaction = models.ForeignKey(
        "payments.Transaction",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="subscription",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancellation_reason = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.user.username} - {self.plan.name} ({self.status})"

    def save(self, *args, **kwargs):
        # Set end_date based on plan duration if not set
        if not self.end_date:
            from datetime import timedelta
            self.end_date = self.start_date + timedelta(days=self.plan.duration_days)
        # Normalize end_date to a datetime if a date was provided by tests
        from datetime import datetime, date, time, timedelta
        if isinstance(self.end_date, date) and not isinstance(self.end_date, datetime):
            # convert date to timezone-aware datetime at end of day
            end_dt = datetime.combine(self.end_date, time.max)
            try:
                end_dt = timezone.make_aware(end_dt)
            except Exception:
                # If timezone.make_aware fails (shouldn't in tests), fallback to naive
                pass
            self.end_date = end_dt

        # Update status based on dates
        if self.is_active and self.end_date is not None and timezone.now() > self.end_date:
            self.is_active = False
            self.status = "EXPIRED"
        # If subscription is active and status is still pending, mark active
        if self.is_active and self.status == "PENDING":
            self.status = "ACTIVE"

        super().save(*args, **kwargs)

    def cancel(self, reason=None):
        """Cancel the subscription."""
        self.is_active = False
        self.status = "CANCELLED"
        self.cancelled_at = timezone.now()
        self.cancellation_reason = reason
        self.save()

    def renew(self):
        """Renew the subscription for another period."""
        from datetime import timedelta
        self.start_date = timezone.now()
        self.end_date = self.start_date + timedelta(days=self.plan.duration_days)
        self.is_active = True
        self.status = "ACTIVE"
        self.save()

    def check_expiry(self):
        """Return True if expired and update status accordingly."""
        # Reuse save logic for normalization
        if self.end_date is None:
            return False
        expired = timezone.now() > self.end_date
        if expired:
            self.is_active = False
            self.status = "EXPIRED"
            self.save()
        return expired

    def is_expired(self):
        """Check if subscription has expired."""
        return timezone.now() > self.end_date

    def days_remaining(self):
        """Get number of days remaining in subscription."""
        if self.is_expired():
            return 0
        delta = self.end_date - timezone.now()
        return delta.days

    class Meta:
        verbose_name = "User Subscription"
        verbose_name_plural = "User Subscriptions"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "is_active"]),
            models.Index(fields=["status"]),
            models.Index(fields=["end_date"]),
        ]


class Vehicle(models.Model):
    """Stores details for a user's registered vehicle."""

    FUEL_CHOICES = [
        ("PETROL", "Petrol"),
        ("DIESEL", "Diesel"),
        ("EV", "Electric Vehicle"),
    ]

    # Use CustomUser model via get_user_model() reference
    owner = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="vehicles"
    )
    license_plate = models.CharField(max_length=20, unique=True)
    make = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    fuel_type = models.CharField(max_length=10, choices=FUEL_CHOICES)
    
    VEHICLE_TYPE_CHOICES = [
        ("TWO_WHEELER", "Two Wheeler (Bike/Scooter)"),
        ("THREE_WHEELER", "Three Wheeler (Auto Rickshaw)"),
        ("FOUR_WHEELER", "Four Wheeler (Car/Sedan/Hatchback)"),
        ("SUV", "SUV (Sport Utility Vehicle)"),
        ("VAN", "Van (Minivan/Cargo Van)"),
        ("TRUCK", "Truck (Light/Medium Commercial)"),
    ]
    vehicle_type = models.CharField(
        max_length=20, 
        choices=VEHICLE_TYPE_CHOICES, 
        default="FOUR_WHEELER",
        help_text="Type of vehicle for appropriate service and pricing"
    )

    insurance_expiry = models.DateField(null=True, blank=True)
    puc_expiry = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.license_plate} ({self.make})"


class ServiceRequest(models.Model):
    """Records a single instance of requested roadside assistance."""

    STATUS_CHOICES = [
        ("PENDING_DISPATCH", "Pending Dispatch"),
        ("DISPATCHED", "Provider En Route"),
        ("ARRIVED", "Provider Arrived"),
        ("SERVICE_IN_PROGRESS", "Service in Progress"),
        ("AWAITING_FINAL_FARE", "Provider Finalizing Fare"),
        ("FINAL_FARE_PENDING", "Waiting for User Approval of Final Fare"),
        ("COMPLETED", "Completed & Paid"),
        ("CANCELLED", "Cancelled"),
    ]
    PRIORITY_CHOICES = [
        ("LOW", "Low"),
        ("MEDIUM", "Medium"),
        ("HIGH", "High"),
        ("URGENT", "Urgent (IoT)"),
    ]

    # Use CustomUser model reference for Foreign Keys
    booker = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, related_name="requests_made"
    )
    provider = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="requests_handled",
    )
    vehicle = models.ForeignKey(
        Vehicle, on_delete=models.SET_NULL, null=True, related_name="service_requests"
    )

    SERVICE_TYPE_CHOICES = [
        ("TOWING", "Towing Service"),
        ("FLAT_TIRE", "Flat Tire Assistance"),
        ("BATTERY_JUMP", "Battery Jumpstart"),
        ("FUEL_DELIVERY", "Fuel Delivery"),
        ("MECHANIC", "Mechanical Issue"),
        ("LOCKOUT", "Lockout Service"),
        ("OTHER", "Other Inquiry"),
    ]

    service_type = models.CharField(max_length=50, choices=SERVICE_TYPE_CHOICES)
    status = models.CharField(
        max_length=30, choices=STATUS_CHOICES, default="PENDING_DISPATCH"
    )
    priority = models.CharField(
        max_length=10, choices=PRIORITY_CHOICES, default="MEDIUM"
    )

    latitude = models.DecimalField(max_digits=10, decimal_places=8)
    longitude = models.DecimalField(max_digits=10, decimal_places=8)
    location_name = models.CharField(max_length=255, blank=True, null=True, help_text="Readable address for the incident location")
    customer_notes = models.TextField(blank=True, null=True)
    placement_details = models.JSONField(
        default=dict, blank=True, null=True, 
        help_text="Privacy-safe location details for vehicle placement"
    )

    source = models.CharField(
        max_length=20, default="APP", help_text="Source: APP, IoT Device, or HELPLINE"
    )
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Request {self.id} - {self.service_type} ({self.status})"

    class Meta:
        verbose_name = "Service Request"
        verbose_name_plural = "Service Requests"
        ordering = ["-created_at"]


class ServiceQuote(models.Model):
    """Dynamic pricing quote for a service request."""
    request = models.ForeignKey(ServiceRequest, on_delete=models.CASCADE, related_name="quotes")
    base_price = models.DecimalField(max_digits=8, decimal_places=2, help_text="Base price for the service type")
    distance_km = models.DecimalField(max_digits=6, decimal_places=2, help_text="Distance from provider to location")
    time_estimate_minutes = models.IntegerField(help_text="Estimated time in minutes")
    dynamic_total = models.DecimalField(max_digits=10, decimal_places=2, help_text="Total after applying plan rates and distance")
    STATUS_CHOICES = [
        ("PENDING", "Pending user approval"),
        ("ACCEPTED", "User accepted the quote"),
        ("REJECTED", "User rejected the quote"),
    ]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="PENDING")
    valid_until = models.DateTimeField(help_text="Quote expiration time")
    
    # New fields for Final Fare logic
    spare_parts_total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    platform_fee = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    tax_amount = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    is_final = models.BooleanField(default=False, help_text="True if this is the final fare after service")
    spare_parts_details = models.JSONField(default=list, blank=True, help_text="List of spare parts used: [{'name': '...', 'price': 100}]")
    
    # Financial Breakup (Calculated on save/finalize)
    provider_payout = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    expenses_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    platform_profit = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)

    def finalize_quote(self, spare_parts=None, platform_fee=Decimal("20.00"), tax_rate=Decimal("0.05")):
        """
        Finalizes the fare after service completion.
        spare_parts: list of {'name': '...', 'price': 100}
        """
        if spare_parts:
            self.spare_parts_details = spare_parts
            self.spare_parts_total = sum(Decimal(str(p['price'])) for p in spare_parts)
        
        # Service Portion = Base + Distance
        service_portion = self.base_price + self.distance_km * Decimal("15.00") # simplified for now
        
        self.platform_fee = platform_fee
        # Tax on everything except spare parts? Or everything? Let's say everything.
        subtotal = service_portion + self.spare_parts_total + self.platform_fee
        self.tax_amount = (subtotal * tax_rate).quantize(Decimal("0.01"))
        
        self.dynamic_total = subtotal + self.tax_amount
        
        # Financial Breakup as per user suggestion:
        # Provider gets 70% of service portion + 100% of spare parts
        self.provider_payout = (service_portion * Decimal("0.70")) + self.spare_parts_total
        # Expenses is 8% of service portion
        self.expenses_amount = (service_portion * Decimal("0.08"))
        # Platform profit is the rest (taxes + platform fee + remaining service portion)
        self.platform_profit = self.dynamic_total - self.provider_payout - self.expenses_amount
        
        self.is_final = True
        self.status = "PENDING" # Reset to pending for user approval of final bill
        self.save()
        
        # Update Request Status
        self.request.status = "FINAL_FARE_PENDING"
        self.request.save()

    def __str__(self):
        return f"Quote for Request {self.request.id} - {self.status}"

    class Meta:
        verbose_name = "Service Quote"
        verbose_name_plural = "Service Quotes"
        ordering = ["-created_at"]


class Review(models.Model):
    """User rating and feedback for a completed service."""
    request = models.OneToOneField(ServiceRequest, on_delete=models.CASCADE, related_name="review")
    booker = models.ForeignKey("users.ServiceBooker", on_delete=models.CASCADE)
    provider = models.ForeignKey("users.ServiceProvider", on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField(help_text="Rating 1-5")
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review {self.id} - {self.rating} stars"

    class Meta:
        verbose_name = "Review"
        verbose_name_plural = "Reviews"
        indexes = [models.Index(fields=["rating"])]


class VehicleExchange(models.Model):
    """
    Replacement Vehicle Service - Provides a temporary rental vehicle 
    while user's original vehicle is being serviced/repaired.
    
    NOT for buying/selling vehicles. Premium/Elite feature only.
    """
    request = models.OneToOneField(ServiceRequest, on_delete=models.CASCADE, related_name="exchange")
    original_vehicle = models.ForeignKey(
        Vehicle, on_delete=models.CASCADE, 
        related_name="exchanges_as_original",
        null=True, blank=True,
        help_text="User's original vehicle - assigned by support when processing request"
    )
    rental_vehicle = models.ForeignKey(
        Vehicle, on_delete=models.CASCADE, 
        related_name="exchanges_as_rental",
        null=True, blank=True,
        help_text="Temporary rental vehicle provided - assigned by support"
    )
    pickup_location = models.CharField(max_length=255)
    return_location = models.CharField(max_length=255)
    rental_fee = models.DecimalField(max_digits=8, decimal_places=2)
    STATUS_CHOICES = [
        ("REQUESTED", "User requested exchange"),
        ("PROVIDED", "Rental vehicle provided"),
        ("COMPLETED", "Exchange completed"),
        ("CANCELLED", "Exchange cancelled"),
    ]
    status = models.CharField(max_length=12, choices=STATUS_CHOICES, default="REQUESTED")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Replacement Vehicle for Request {self.request.id} - {self.status}"

    class Meta:
        verbose_name = "Replacement Vehicle Request"
        verbose_name_plural = "Replacement Vehicle Requests"
        ordering = ["-created_at"]


class SparePartStore(models.Model):
    """Stores information about nearby spare part stores for providers to fetch."""
    name = models.CharField(max_length=255)
    location_name = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=10, decimal_places=8)
    longitude = models.DecimalField(max_digits=10, decimal_places=8)
    inventory = models.JSONField(default=dict, help_text="Available parts and prices: {'accelerator_wire': 349}")
    contact_number = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return self.name

class VehiclePlacement(models.Model):
    """Request to move a vehicle to a specified location after service."""
    request = models.OneToOneField(ServiceRequest, on_delete=models.CASCADE, related_name="placement")
    destination_address = models.CharField(max_length=255)
    destination_latitude = models.DecimalField(max_digits=10, decimal_places=8)
    destination_longitude = models.DecimalField(max_digits=10, decimal_places=8)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    STATUS_CHOICES = [
        ("REQUESTED", "Placement requested"),
        ("IN_PROGRESS", "Vehicle being moved"),
        ("COMPLETED", "Placement done"),
        ("CANCELLED", "Placement cancelled"),
    ]
    status = models.CharField(max_length=12, choices=STATUS_CHOICES, default="REQUESTED")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Placement for Request {self.request.id} - {self.status}"

    class Meta:
        verbose_name = "Vehicle Placement"
        verbose_name_plural = "Vehicle Placements"
        ordering = ["-created_at"]


class HelplineCall(models.Model):
    """Log of a helpline call linked to a service request."""
    caller = models.ForeignKey("users.ServiceBooker", on_delete=models.CASCADE, related_name="helpline_calls")
    operator = models.ForeignKey("users.ServiceProvider", on_delete=models.SET_NULL, null=True, blank=True, related_name="handled_calls")
    call_start = models.DateTimeField()
    call_end = models.DateTimeField(null=True, blank=True)
    recording_url = models.URLField(blank=True, null=True)
    linked_service_request = models.ForeignKey(ServiceRequest, on_delete=models.SET_NULL, null=True, blank=True, related_name="helpline_calls")
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def duration_seconds(self):
        if self.call_end:
            return (self.call_end - self.call_start).total_seconds()
        return None

    def __str__(self):
        return f"Helpline Call {self.id} by {self.caller.user.username}"

    class Meta:
        verbose_name = "Helpline Call"
        verbose_name_plural = "Helpline Calls"
        ordering = ["-call_start"]



class SMSMessageLog(models.Model):
    """Log of SMS messages sent via the free SMS gateway."""
    to_number = models.CharField(max_length=20)
    message_body = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, help_text="Sent, Failed, etc.")
    gateway_response = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"SMS to {self.to_number} at {self.sent_at} - {self.status}"

    class Meta:
        verbose_name = "SMS Message Log"
        verbose_name_plural = "SMS Message Logs"
        indexes = [models.Index(fields=["to_number", "sent_at"])]


class Wallet(models.Model):
    """
    Digital wallet for users to store money and get cashback/rewards.
    Makes service more affordable for budget-conscious users.
    """
    user = models.OneToOneField(
        "users.ServiceBooker",
        on_delete=models.CASCADE,
        related_name="wallet",
        primary_key=True
    )
    balance = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00"),
        help_text="Current wallet balance in INR"
    )
    total_earned = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00"),
        help_text="Total rewards earned"
    )
    total_spent = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal("0.00"),
        help_text="Total amount spent from wallet"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def add_money(self, amount, description="Added to wallet"):
        """Add money to wallet."""
        # ensure Decimal arithmetic
        if not isinstance(amount, Decimal):
            amount = Decimal(str(amount))
        self.balance += amount
        self.save()
        
        # Create transaction record
        WalletTransaction.objects.create(
            wallet=self,
            transaction_type="CREDIT",
            amount=amount,
            description=description
        )
    
    def deduct_money(self, amount, description="Payment for service"):
        """Deduct money from wallet."""
        if not isinstance(amount, Decimal):
            amount = Decimal(str(amount))

        if self.balance >= amount:
            self.balance -= amount
            self.total_spent += amount
            self.save()
            
            # Create transaction record
            WalletTransaction.objects.create(
                wallet=self,
                transaction_type="DEBIT",
                amount=amount,
                description=description
            )
            return True
        return False
    
    def add_reward(self, amount, description="Reward earned"):
        """Add reward money to wallet."""
        if not isinstance(amount, Decimal):
            amount = Decimal(str(amount))

        self.balance += amount
        self.total_earned += amount
        self.save()
        
        # Create transaction record
        WalletTransaction.objects.create(
            wallet=self,
            transaction_type="REWARD",
            amount=amount,
            description=description
        )

    def __str__(self):
        return f"Wallet for {self.user.user.username} - ₹{self.balance}"

    class Meta:
        verbose_name = "Wallet"
        verbose_name_plural = "Wallets"


class WalletTransaction(models.Model):
    """Record of all wallet transactions."""
    
    TRANSACTION_TYPES = [
        ("CREDIT", "Money Added"),
        ("DEBIT", "Money Spent"),
        ("REWARD", "Reward Earned"),
        ("REFUND", "Refund Received"),
    ]
    
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name="transactions")
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    balance_after = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Store balance after transaction
        self.balance_after = self.wallet.balance
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.transaction_type} - ₹{self.amount} on {self.created_at.date()}"

    class Meta:
        verbose_name = "Wallet Transaction"
        verbose_name_plural = "Wallet Transactions"
        ordering = ["-created_at"]


class RewardsProgram(models.Model):
    """
    Loyalty rewards program to encourage repeat usage.
    Budget-friendly incentives for all user segments.
    """
    user = models.OneToOneField(
        "users.ServiceBooker",
        on_delete=models.CASCADE,
        related_name="rewards",
        primary_key=True
    )
    points = models.IntegerField(default=0, help_text="Loyalty points earned")
    tier = models.CharField(
        max_length=20,
        choices=[
            ("BRONZE", "Bronze - 0-499 points"),
            ("SILVER", "Silver - 500-1499 points"),
            ("GOLD", "Gold - 1500+ points"),
        ],
        default="BRONZE"
    )
    total_services_used = models.IntegerField(default=0)
    referral_code = models.CharField(max_length=10, unique=True, blank=True)
    referrals_made = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def add_points(self, points, reason="Service completed"):
        """Add loyalty points and update tier."""
        self.points += points
        self.update_tier()
        self.save()
        
        # Create reward transaction
        RewardTransaction.objects.create(
            rewards_program=self,
            points=points,
            transaction_type="EARNED",
            description=reason
        )
    
    def redeem_points(self, points, reason="Points redeemed"):
        """Redeem points for wallet cash."""
        if self.points >= points:
            self.points -= points
            self.update_tier()
            self.save()
            
            # Convert points to cash (1 point = ₹0.10)
            cash_value = points * 0.10
            self.user.wallet.add_reward(cash_value, f"Redeemed {points} points")
            
            # Create reward transaction
            RewardTransaction.objects.create(
                rewards_program=self,
                points=-points,
                transaction_type="REDEEMED",
                description=reason
            )
            return True
        return False
    
    def reward_for_service(self, service_request):
        """
        Calculate and add reward points for a completed service.
        Formula: (Base 10 + 1 per km) * Tier Multiplier
        """
        base_points = 10
        distance_km = 0
        
        # Try to get distance from an accepted quote
        quote = service_request.quotes.filter(status="ACCEPTED").first()
        if quote:
            distance_km = float(quote.distance_km)
        
        multipliers = {
            'BRONZE': 1.0,
            'SILVER': 1.5,
            'GOLD': 2.0
        }
        multiplier = multipliers.get(self.tier, 1.0)
        
        points_to_add = int((base_points + distance_km) * multiplier)
        self.add_points(points_to_add, f"Service #{service_request.id} ({service_request.service_type}) completed")
        return points_to_add

    def update_tier(self):
        """Update user tier based on points."""
        if self.points >= 1500:
            self.tier = "GOLD"
        elif self.points >= 500:
            self.tier = "SILVER"
        else:
            self.tier = "BRONZE"
    
    def generate_referral_code(self):
        """Generate unique referral code."""
        import random
        import string
        if not self.referral_code:
            code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
            self.referral_code = f"VA{code}"
            self.save()
        return self.referral_code

    def __str__(self):
        return f"{self.user.user.username} - {self.tier} ({self.points} points)"

    class Meta:
        verbose_name = "Rewards Program"
        verbose_name_plural = "Rewards Programs"


class Referral(models.Model):
    """Tracks user referrals and reward distribution."""
    referrer = models.ForeignKey("users.ServiceBooker", on_delete=models.CASCADE, related_name='referrals_out')
    referred_user = models.OneToOneField("users.ServiceBooker", on_delete=models.CASCADE, related_name='referral_in')
    reward_points = models.IntegerField(default=500)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.referrer.user.username} referred {self.referred_user.user.username}"


class RewardTransaction(models.Model):
    """Record of all reward point transactions."""
    
    TRANSACTION_TYPES = [
        ("EARNED", "Points Earned"),
        ("REDEEMED", "Points Redeemed"),
        ("EXPIRED", "Points Expired"),
        ("BONUS", "Bonus Points"),
    ]
    
    rewards_program = models.ForeignKey(RewardsProgram, on_delete=models.CASCADE, related_name="transactions")
    points = models.IntegerField()
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    description = models.TextField()
    points_balance_after = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Store points balance after transaction
        self.points_balance_after = self.rewards_program.points
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.transaction_type} - {self.points} points on {self.created_at.date()}"

    class Meta:
        verbose_name = "Reward Transaction"
        verbose_name_plural = "Reward Transactions"
        ordering = ["-created_at"]


class ChatMessage(models.Model):
    """Real-time chat messages between booker and provider."""
    request = models.ForeignKey(ServiceRequest, on_delete=models.CASCADE, related_name="chat_messages")
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    message = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to="chat_attachments/", blank=True, null=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Chat for Request {self.request.id} by {self.sender.username}"

    class Meta:
        verbose_name = "Chat Message"
        verbose_name_plural = "Chat Messages"
        ordering = ["created_at"]
