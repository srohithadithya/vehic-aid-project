import pytest
from decimal import Decimal
from apps.payments.financial_tools import calculate_payout_splits, validate_payout_details, FinancialError
from apps.users.models import ServiceProvider, CustomUser

# Test cases for the core business rule: 20% platform commission

def test_payout_split_standard_amount():
    """Tests commission calculation on a clean, round number."""
    # Assuming PLATFORM_COMMISSION_RATE = 0.20 (20%)
    amount = Decimal('1000.00')
    splits = calculate_payout_splits(amount)
    
    assert splits['platform_commission'] == Decimal('200.00')
    assert splits['provider_payout_amount'] == Decimal('800.00')

def test_payout_split_decimal_rounding():
    """Tests calculation and rounding for non-clean amounts."""
    amount = Decimal('123.45')
    splits = calculate_payout_splits(amount)
    
    # 123.45 * 0.20 = 24.690. Should round to 24.69
    assert splits['platform_commission'] == Decimal('24.69')
    assert splits['provider_payout_amount'] == Decimal('98.76')
    
    # Check that the sum is equal to the original amount (123.45)
    assert splits['platform_commission'] + splits['provider_payout_amount'] == amount

def test_payout_split_below_min_transaction():
    """Tests that a transaction below the minimum limit raises a custom error."""
    # Assuming MIN_TRANSACTION_AMOUNT is 10.00 (from financial_tools.py)
    amount = Decimal('5.00')
    with pytest.raises(FinancialError, match="below the minimum required amount"):
        calculate_payout_splits(amount)

def test_payout_details_ifsc_validation():
    """Tests the validation of India-specific IFSC codes."""
    # Setup a mock provider
    user = CustomUser.objects.create_user(username='mock_sp', email='mock@sp.com', password='p', is_service_provider=True)
    
    # Test 1: Valid IFSC
    provider_valid = ServiceProvider.objects.create(user=user, bank_account_number='1234567890', bank_ifsc_code='HDFC0000123')
    assert validate_payout_details(provider_valid) is True
    
    # Test 2: Invalid IFSC (missing the required '0' at the 5th character)
    provider_invalid = ServiceProvider.objects.get(pk=provider_valid.pk)
    provider_invalid.bank_ifsc_code = 'HDFCB000123'
    with pytest.raises(FinancialError, match="Invalid IFSC code format"):
        validate_payout_details(provider_invalid)