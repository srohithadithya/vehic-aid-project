from datetime import timedelta
from decimal import Decimal

from celery import shared_task
from django.db.models import Sum
from django.utils import timezone

from apps.services.models import ServiceRequest  # Assumed import

from .models import DailySettlement, Transaction

# Assuming an external API client for initiating provider payouts (e.g., Razorpay Payouts API)
# import razorpay_payouts_client


def initiate_payout_to_provider(provider_id: int, amount: Decimal):
    """
    Placeholder function for initiating the actual bank transfer via a payment gateway.
    In a real system, this calls a third-party Payouts API (e.g., Razorpay/Stripe).
    """
    print(f"Initiating Payout: Provider {provider_id} | Amount {amount}")
    # --- Actual API Call Logic ---
    # response = razorpay_payouts_client.create_payout(provider_id, amount)
    # if response.status == 'success':
    #     return True
    # return False
    return True  # Mock success for demonstration


@shared_task(name="payments.run_daily_settlement")
def run_daily_settlement():
    """
    Celery Beat task run daily (e.g., 03:00 AM IST) to aggregate earnings
    and initiate payouts for the previous day.
    """
    yesterday = (timezone.now() - timedelta(days=1)).date()

    # 1. Check if settlement for this date already exists
    if DailySettlement.objects.filter(date=yesterday).exists():
        print(f"Settlement for {yesterday} already processed. Skipping.")
        return False

    # 2. Find all successful, unsettled transactions from the previous day
    start_of_day = timezone.make_aware(
        timezone.datetime(yesterday.year, yesterday.month, yesterday.day)
    )
    end_of_day = start_of_day + timedelta(days=1)

    unsettled_txns = Transaction.objects.filter(
        status="SUCCESS",
        settled=False,
        created_at__gte=start_of_day,
        created_at__lt=end_of_day,
    )

    if not unsettled_txns.exists():
        print(f"No new transactions to settle for {yesterday}.")
        return False

    # 3. Aggregate Payouts by Provider
    payout_summary = unsettled_txns.values("provider_id").annotate(
        total_payout=Sum("provider_payout_amount")
    )

    successful_payout_count = 0
    total_provider_payout = Decimal("0.00")
    total_platform_commission = Decimal("0.00")

    # 4. Process individual Payouts
    for summary in payout_summary:
        provider_id = summary["provider_id"]
        amount = summary["total_payout"]

        # Initiate the external bank transfer
        if initiate_payout_to_provider(provider_id, amount):
            total_provider_payout += amount
            successful_payout_count += 1
        else:
            # Handle payout failure (e.g., log, mark transactions for retry)
            print(f"ERROR: Payout failed for Provider {provider_id}")

    # 5. Calculate Final Platform Revenue
    total_platform_commission = unsettled_txns.aggregate(Sum("platform_commission"))[
        "platform_commission__sum"
    ] or Decimal("0.00")

    # 6. Record the Daily Settlement
    DailySettlement.objects.create(
        date=yesterday,
        total_platform_revenue=total_platform_commission,
        total_provider_payout=total_provider_payout,
        transaction_count=unsettled_txns.count(),
    )

    # 7. Mark successfully processed transactions as settled
    # (Important: Only mark as settled AFTER the daily record is created)
    unsettled_txns.update(settled=True)

    print(
        f"Settlement Complete for {yesterday}. Total Payouts: {total_provider_payout}"
    )
    return True
