
import pytest
from decimal import Decimal
from unittest.mock import patch, MagicMock
from apps.services.services.pricing import PricingService

@pytest.fixture
def pricing_service():
    return PricingService()

class TestPricingService:
    
    def test_calculate_quote_basic_four_wheeler(self, pricing_service):
        """
        Test basic quote calculation for a 4-wheeler without surge or discount.
        """
        # Mock distance calculation to return 10km, 30 mins
        with patch.object(pricing_service, 'calculate_distance', return_value=(Decimal("10.0"), 30)):
            quote = pricing_service.calculate_quote(
                service_type="TOWING",
                provider_lat=12.9716, provider_lng=77.5946,
                customer_lat=12.9352, customer_lng=77.6245,
                vehicle_type="FOUR_WHEELER",
                user_plan="FREE",
                apply_surge=False
            )
            
            # Base price for 4-wheeler towing = 300.00
            # Distance charge = 10km * 10rs/km = 100.00
            # Total = 400.00
            assert quote["base_price"] == Decimal("300.00")
            assert quote["distance_charge"] == Decimal("100.00")
            assert quote["dynamic_total"] == Decimal("400.00")

    def test_calculate_quote_two_wheeler_fuel(self, pricing_service):
        """
        Test budget-friendly quote for 2-wheeler fuel delivery.
        """
        with patch.object(pricing_service, 'calculate_distance', return_value=(Decimal("5.0"), 15)):
            quote = pricing_service.calculate_quote(
                service_type="FUEL_DELIVERY",
                provider_lat=12.9716, provider_lng=77.5946,
                customer_lat=12.9720, customer_lng=77.5950,
                vehicle_type="TWO_WHEELER",
                user_plan="FREE",
                apply_surge=False
            )
            
            # Base price for 2-wheeler fuel = 70.00
            # Distance charge = 5km * 5rs/km = 25.00
            # Total = 95.00
            assert quote["base_price"] == Decimal("70.00")
            assert quote["distance_charge"] == Decimal("25.00")
            assert quote["dynamic_total"] == Decimal("95.00")

    def test_apply_subscription_discount(self, pricing_service):
        """
        Test that PREMIUM plan gets 25% discount.
        """
        with patch.object(pricing_service, 'calculate_distance', return_value=(Decimal("10.0"), 30)):
            quote = pricing_service.calculate_quote(
                service_type="TOWING",
                provider_lat=12.9716, provider_lng=77.5946,
                customer_lat=12.9352, customer_lng=77.6245,
                vehicle_type="FOUR_WHEELER",
                user_plan="PREMIUM", # 25% off
                apply_surge=False
            )
            
            # Subtotal was 400.00
            # Discount = 400 * 0.25 = 100.00
            # Total = 300.00
            assert quote["subtotal"] == Decimal("400.00")
            assert quote["discount_amount"] == Decimal("100.00")
            assert quote["dynamic_total"] == Decimal("300.00")

    def test_surge_pricing_peak_hours(self, pricing_service):
        """
        Test surge pricing multiplier logic.
        """
        # Mock datetime to be Monday 9 AM (Peak)
        with patch("apps.services.services.pricing.datetime") as mock_datetime:
            mock_now = MagicMock()
            mock_now.hour = 9
            mock_now.weekday.return_value = 0 # Monday
            mock_datetime.now.return_value = mock_now
            
            multiplier = pricing_service.get_surge_multiplier()
            assert multiplier == Decimal("1.2") # 20% surge

    def test_surge_pricing_off_peak(self, pricing_service):
        """
        Test surge pricing is 1.0 during off-peak.
        """
        # Mock datetime to be Monday 2 PM (Off-Peak)
        with patch("apps.services.services.pricing.datetime") as mock_datetime:
            mock_now = MagicMock()
            mock_now.hour = 14
            mock_now.weekday.return_value = 0
            mock_datetime.now.return_value = mock_now
            
            multiplier = pricing_service.get_surge_multiplier()
            assert multiplier == Decimal("1.0")
