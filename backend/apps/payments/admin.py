# backend/apps/payments/admin.py

from django.contrib import admin

from .models import DailySettlement, Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    # FIXES: Corrected 'request' to 'service_request' and fees to match model names
    list_display = (
        "id",
        "service_request",  # FIX E108: Changed 'request' to 'service_request'
        "amount",
        "platform_fee",  # FIX E108: Corrected 'platform_fee'
        "provider_payout",  # FIX E108: Corrected 'provider_payout'
        "status",
        "created_at",
    )
    # FIXES: Corrected 'payment_method' field to exist in the model
    list_filter = ("status", "payment_method")
    search_fields = ("service_request__id", "provider__user__email")

    # FIX: Adding a method to display the related request ID cleanly
    def request_id(self, obj):
        return obj.service_request.id if obj.service_request else "N/A"

    request_id.short_description = "Request ID"


@admin.register(DailySettlement)
class DailySettlementAdmin(admin.ModelAdmin):
    # FIXES: Corrected field names to match the model
    list_display = (
        "settlement_date",  # FIX E108: Corrected 'settlement_date'
        "total_platform_revenue",
        "total_provider_payout_amount",  # FIX E108: Corrected 'total_payout_amount'
        "status",
    )
    # FIXES: Corrected list_filter to use the existing 'status' field
    list_filter = ("status",)

    # FIXES: Corrected ordering field name
    ordering = ("-settlement_date",)  # FIX E033: Corrected 'settlement_date'

    search_fields = ("settlement_date",)
