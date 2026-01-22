import re
from decimal import Decimal, InvalidOperation

from django.conf import settings

from apps.users.models import ServiceProvider

# --- Configuration ---
# Platform commission rate (25%) loaded from Django settings.
# Provider receives 75% of service charges, platform keeps 25% + platform fee.
PLATFORM_COMMISSION_RATE = Decimal(getattr(settings, "PLATFORM_COMMISSION_RATE", "0.25"))
PLATFORM_FEE = Decimal(getattr(settings, "PLATFORM_FEE", "11.00"))  # ₹11 per service
MIN_TRANSACTION_AMOUNT = Decimal("10.00")

# --- Validation Constants for Indian Banking ---
# Standard IFSC Code format (4 letters, 0, 6 alphanumeric characters)
IFSC_REGEX = re.compile(r"^[A-Z]{4}0[A-Z0-9]{6}$")


# --- Error Codes ---
class FinancialError(Exception):
    pass


## Core Financial Functions


def calculate_payout_splits(total_amount: Decimal) -> dict:
    """
    Calculates the platform commission and the final payout amount for the provider.

    Args:
        total_amount: The total amount collected from the customer.

    Returns:
        A dictionary containing commission, payout, and net amounts.
    """
    try:
        total_amount = total_amount.quantize(Decimal("0.01"))
    except InvalidOperation:
        raise FinancialError("Invalid amount provided for calculation.")

    if total_amount < MIN_TRANSACTION_AMOUNT:
        raise FinancialError(
            f"Amount {total_amount} is below the minimum required amount."
        )

    # Calculate splits
    commission = total_amount * PLATFORM_COMMISSION_RATE
    # Round commission to two decimal places
    commission = commission.quantize(Decimal("0.01"))

    provider_payout = total_amount - commission

    return {
        "total_amount": total_amount,
        "platform_commission": commission,
        "provider_payout_amount": provider_payout,
    }


def validate_payout_details(provider: ServiceProvider) -> bool:
    """
    Checks if the Service Provider has complete and correctly formatted payout details.
    This check is crucial before running the daily settlement.
    """
    if not provider.bank_account_number or not provider.bank_ifsc_code:
        raise FinancialError("Provider is missing bank account or IFSC details.")

    # 1. Basic length check
    if len(provider.bank_account_number) < 9 or len(provider.bank_account_number) > 18:
        raise FinancialError("Invalid bank account number length.")

    # 2. IFSC format check (India specific)
    if not IFSC_REGEX.match(provider.bank_ifsc_code):
        raise FinancialError(
            "Invalid IFSC code format (must be 4 letters, 0, 6 alphanumeric)."
        )

    # 3. Razorpay/API-specific validation could be added here (e.g., check name match)

    return True


def perform_payout_security_checks(transaction_list: list) -> bool:
    """
    Performs aggregated security checks on a batch of transactions before settlement.
    Placeholder for AML (Anti-Money Laundering) checks.
    """
    total_batch_amount = sum(t.amount for t in transaction_list)
    transaction_count = len(transaction_list)

    if transaction_count > 500:
        # Flag unusually high transaction volume for manual review
        print(
            f"ALERT: High transaction count ({transaction_count}) detected for settlement batch."
        )

    if total_batch_amount > Decimal("500000.00"):
        # Flag large sum for potential PMLA/AML compliance review
        print(f"ALERT: Large aggregate payout amount ({total_batch_amount}) detected.")

    # Placeholder for checking if any provider in the batch is on a fraud watchlist.
    # if any(provider.is_flagged_for_fraud for provider in transaction_list):
    #    return False

    return True
