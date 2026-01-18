from django.contrib import admin
from .models import (
    ServiceRequest, SubscriptionPlan, Vehicle, UserSubscription,
    ServiceQuote, Review, VehicleExchange, VehiclePlacement,
    HelplineCall, SMSMessageLog, Wallet, WalletTransaction,
    RewardsProgram, RewardTransaction, ChatMessage
)

class ChatMessageInline(admin.TabularInline):
    model = ChatMessage
    extra = 0
    readonly_fields = ('sender', 'message', 'image', 'created_at')

@admin.register(ServiceRequest)
class ServiceRequestAdmin(admin.ModelAdmin):
    list_display = ("id", "booker", "service_type", "status", "priority", "created_at")
    list_filter = ("status", "priority", "service_type", "source")
    search_fields = ("booker__email", "id")
    ordering = ("-created_at",)
    inlines = [ChatMessageInline]

admin.site.register(ChatMessage)
admin.site.register(Vehicle)

admin.site.register(SubscriptionPlan)
admin.site.register(UserSubscription)
admin.site.register(ServiceQuote)
admin.site.register(Review)
admin.site.register(VehicleExchange)
admin.site.register(VehiclePlacement)
admin.site.register(HelplineCall)
admin.site.register(SMSMessageLog)
admin.site.register(Wallet)
admin.site.register(WalletTransaction)
admin.site.register(RewardsProgram)
admin.site.register(RewardTransaction)
