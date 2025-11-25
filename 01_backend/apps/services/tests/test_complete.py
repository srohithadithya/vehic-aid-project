"""
Comprehensive test suite for Vehic-Aid backend.
Tests all core functionality including pricing, wallet, rewards, and subscriptions.
"""

import pytest
from decimal import Decimal
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import get_user_model
from apps.services.models import (
    SubscriptionPlan, UserSubscription, Wallet, WalletTransaction,
    RewardsProgram, RewardTransaction, ServiceRequest
)
from apps.services.services.pricing import PricingService

User = get_user_model()


@pytest.mark.django_db
class TestPricingService:
    """Test dynamic pricing calculations."""
    
    def test_two_wheeler_pricing(self):
        """Test budget-friendly two-wheeler pricing."""
        pricing = PricingService()
        quote = pricing.calculate_quote(
            service_type="TOWING",
            provider_lat=28.6139,
            provider_lng=77.2090,
            customer_lat=28.6239,
            customer_lng=77.2190,
            vehicle_type="TWO_WHEELER",
            user_plan="FREE",
            apply_surge=False
        )
        
        assert quote['base_price'] == Decimal('150.00')
        assert quote['per_km_rate'] == Decimal('5.00')
        assert quote['discount_rate'] == Decimal('0.00')
        assert quote['surge_multiplier'] == Decimal('1.0')
    
    def test_premium_discount(self):
        """Test 25% premium subscription discount."""
        pricing = PricingService()
        quote = pricing.calculate_quote(
            service_type="JUMPSTART",
            provider_lat=28.6139,
            provider_lng=77.2090,
            customer_lat=28.6239,
            customer_lng=77.2190,
            vehicle_type="FOUR_WHEELER",
            user_plan="PREMIUM",
            apply_surge=False
        )
        
        assert quote['discount_rate'] == Decimal('0.25')
        assert quote['discount_amount'] > 0


@pytest.mark.django_db
class TestWalletSystem:
    """Test wallet functionality."""
    
    @pytest.fixture
    def user(self):
        """Create test user."""
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        user.is_service_booker = True
        user.save()
        return user
    
    @pytest.fixture
    def wallet(self, user):
        """Create test wallet."""
        from apps.users.models import ServiceBooker
        booker = ServiceBooker.objects.create(user=user)
        wallet = Wallet.objects.create(user=booker)
        return wallet
    
    def test_add_money(self, wallet):
        """Test adding money to wallet."""
        initial_balance = wallet.balance
        wallet.add_money(Decimal('500.00'), "Test deposit")
        
        assert wallet.balance == initial_balance + Decimal('500.00')
        assert WalletTransaction.objects.filter(wallet=wallet).count() == 1
    
    def test_deduct_money_success(self, wallet):
        """Test successful money deduction."""
        wallet.add_money(Decimal('1000.00'), "Initial deposit")
        success = wallet.deduct_money(Decimal('300.00'), "Test payment")
        
        assert success is True
        assert wallet.balance == Decimal('700.00')
    
    def test_deduct_money_insufficient(self, wallet):
        """Test deduction with insufficient balance."""
        success = wallet.deduct_money(Decimal('100.00'), "Test payment")
        
        assert success is False
        assert wallet.balance == Decimal('0.00')


@pytest.mark.django_db
class TestRewardsProgram:
    """Test loyalty rewards system."""
    
    @pytest.fixture
    def user(self):
        """Create test user."""
        user = User.objects.create_user(
            username='rewarduser',
            email='reward@example.com',
            password='testpass123'
        )
        user.is_service_booker = True
        user.save()
        return user
    
    @pytest.fixture
    def rewards(self, user):
        """Create rewards program."""
        from apps.users.models import ServiceBooker
        booker = ServiceBooker.objects.create(user=user)
        Wallet.objects.create(user=booker)
        rewards = RewardsProgram.objects.create(user=booker)
        return rewards
    
    def test_add_points(self, rewards):
        """Test adding loyalty points."""
        rewards.add_points(100, "Test service")
        
        assert rewards.points == 100
        assert rewards.tier == "BRONZE"
    
    def test_tier_upgrade(self, rewards):
        """Test automatic tier upgrade."""
        rewards.add_points(600, "Multiple services")
        
        assert rewards.tier == "SILVER"
        
        rewards.add_points(1000, "More services")
        assert rewards.tier == "GOLD"
    
    def test_redeem_points(self, rewards):
        """Test points redemption."""
        rewards.add_points(500, "Earned points")
        success = rewards.redeem_points(200, "Redeem for cash")
        
        assert success is True
        assert rewards.points == 300
        # 200 points = ₹20
        assert rewards.user.wallet.balance == Decimal('20.00')


@pytest.mark.django_db
class TestSubscriptionSystem:
    """Test subscription management."""
    
    @pytest.fixture
    def user(self):
        """Create test user."""
        user = User.objects.create_user(
            username='subuser',
            email='sub@example.com',
            password='testpass123'
        )
        user.is_service_booker = True
        user.save()
        return user
    
    @pytest.fixture
    def premium_plan(self):
        """Create premium plan."""
        return SubscriptionPlan.objects.create(
            name="PREMIUM",
            price=Decimal("999.00"),
            duration_days=30,
            max_requests=999,
            features={"vehicle_exchange": True, "helpline": True}
        )
    
    def test_subscription_creation(self, user, premium_plan):
        """Test creating a subscription."""
        from apps.users.models import ServiceBooker
        booker = ServiceBooker.objects.create(user=user)
        
        subscription = UserSubscription.objects.create(
            user=booker,
            plan=premium_plan,
            auto_renew=True
        )
        
        assert subscription.status == 'ACTIVE'
        assert subscription.is_active is True
        assert subscription.end_date is not None
    
    def test_subscription_expiry(self, user, premium_plan):
        """Test subscription expiry check."""
        from apps.users.models import ServiceBooker
        booker = ServiceBooker.objects.create(user=user)
        
        subscription = UserSubscription.objects.create(
            user=booker,
            plan=premium_plan,
            auto_renew=False
        )
        
        # Set to expired
        subscription.end_date = timezone.now().date() - timedelta(days=1)
        subscription.save()
        
        expired = subscription.check_expiry()
        
        assert expired is True
        assert subscription.status == 'EXPIRED'
        assert subscription.is_active is False


@pytest.mark.django_db
class TestAPIEndpoints:
    """Test API endpoint functionality."""
    
    def test_wallet_endpoint_requires_auth(self, client):
        """Test wallet endpoint requires authentication."""
        response = client.get('/api/v1/services/wallet/1/')
        assert response.status_code == 401
    
    def test_rewards_endpoint_requires_auth(self, client):
        """Test rewards endpoint requires authentication."""
        response = client.get('/api/v1/services/rewards/1/')
        assert response.status_code == 401


# Run with: pytest apps/services/tests/test_complete.py -v
