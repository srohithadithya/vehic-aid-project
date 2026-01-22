from rest_framework import serializers

from .models import (
    ServiceRequest,
    Vehicle,
    SubscriptionPlan,
    UserSubscription,
    ServiceQuote,
    Review,
    VehicleExchange,
    VehiclePlacement,
    HelplineCall,
    SMSMessageLog,
    Wallet,
    WalletTransaction,
    RewardsProgram,
    RewardTransaction,
    ChatMessage,
    SparePartStore,
)


class VehicleSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Vehicle
        fields = ["id", "license_plate", "make", "model", "fuel_type", "vehicle_type", "owner"]
        read_only_fields = ["id", "owner"]


class ServiceRequestSerializer(serializers.ModelSerializer):
    # Field to allow the user to submit a specific vehicle ID
    vehicle_id = serializers.PrimaryKeyRelatedField(
        queryset=Vehicle.objects.all(), write_only=True, required=True, source="vehicle"
    )
    dynamic_total = serializers.SerializerMethodField()

    class Meta:
        model = ServiceRequest
        fields = [
            "id",
            "vehicle_id",
            "service_type",
            "customer_notes",
            "latitude",
            "longitude",
            "location_name",
            "status",
            "priority",
            "created_at",
            "dynamic_total",
        ]
        read_only_fields = ["id", "status", "priority", "created_at", "dynamic_total"]

    def get_dynamic_total(self, obj):
        # Fetch the accepted quote if exists
        quote = obj.quotes.filter(status="ACCEPTED").first()
        if quote:
            return float(quote.dynamic_total)
        # Fallback to pending quote if only one exists
        quote = obj.quotes.first()
        return float(quote.dynamic_total) if quote else None


class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = [
            "id",
            "name",
            "price",
            "duration_days",
            "is_exchange_eligible",
            "description",
            "features",
            "max_requests",
        ]
        read_only_fields = ["id"]


class UserSubscriptionSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    plan = SubscriptionPlanSerializer(read_only=True)

    class Meta:
        model = UserSubscription
        fields = [
            "id",
            "user",
            "plan",
            "start_date",
            "end_date",
            "is_active",
            "auto_renew",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "user", "plan", "created_at", "updated_at"]


class SubscriptionCreateSerializer(serializers.ModelSerializer):
    # user will be provided by the view (request.user.servicebooker)
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    plan = serializers.PrimaryKeyRelatedField(queryset=SubscriptionPlan.objects.all())

    class Meta:
        model = UserSubscription
        fields = ["user", "plan", "auto_renew"]

    def create(self, validated_data):
        return UserSubscription.objects.create(**validated_data)


class ServiceQuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceQuote
        fields = [
            "id",
            "request",
            "base_price",
            "distance_km",
            "time_estimate_minutes",
            "dynamic_total",
            "status",
            "valid_until",
            "created_at",
            "spare_parts_total",
            "platform_fee",
            "tax_amount",
            "is_final",
            "spare_parts_details",
            "provider_payout",
            "expenses_amount",
            "platform_profit",
        ]
        read_only_fields = ["id", "created_at", "provider_payout", "expenses_amount", "platform_profit"]


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["id", "request", "booker", "provider", "rating", "comment", "created_at"]
        read_only_fields = ["id", "created_at"]


class VehicleExchangeSerializer(serializers.ModelSerializer):
    # Make vehicle fields optional - they will be assigned by admin/support
    original_vehicle = serializers.PrimaryKeyRelatedField(
        queryset=Vehicle.objects.all(), 
        required=False, 
        allow_null=True,
        help_text="User's original vehicle - assigned by support"
    )
    rental_vehicle = serializers.PrimaryKeyRelatedField(
        queryset=Vehicle.objects.all(), 
        required=False, 
        allow_null=True,
        help_text="Rental vehicle to be provided - assigned by support"
    )
    
    class Meta:
        model = VehicleExchange
        fields = [
            "id",
            "request",
            "original_vehicle",
            "rental_vehicle",
            "pickup_location",
            "return_location",
            "rental_fee",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class VehiclePlacementSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehiclePlacement
        fields = [
            "id",
            "request",
            "destination_address",
            "destination_latitude",
            "destination_longitude",
            "price",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class HelplineCallSerializer(serializers.ModelSerializer):
    class Meta:
        model = HelplineCall
        fields = [
            "id",
            "caller",
            "operator",
            "call_start",
            "call_end",
            "recording_url",
            "linked_service_request",
            "notes",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class SMSMessageLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SMSMessageLog
        fields = ["id", "to_number", "message_body", "sent_at", "status", "gateway_response"]
        read_only_fields = ["id", "sent_at"]


class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ["user", "balance", "total_earned", "total_spent", "created_at", "updated_at"]
        read_only_fields = ["user", "total_earned", "total_spent", "created_at", "updated_at"]


class WalletTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletTransaction
        fields = ["id", "transaction_type", "amount", "description", "balance_after", "created_at"]
        read_only_fields = ["id", "balance_after", "created_at"]


class RewardsProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = RewardsProgram
        fields = [
            "user", "points", "tier", "total_services_used",
            "referral_code", "referrals_made", "created_at", "updated_at"
        ]
        read_only_fields = ["user", "tier", "created_at", "updated_at"]


class RewardTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RewardTransaction
        fields = ["id", "points", "transaction_type", "description", "points_balance_after", "created_at"]
        read_only_fields = ["id", "points_balance_after", "created_at"]


class ProviderJobSerializer(serializers.ModelSerializer):
    """
    Rich serializer for providers to see job details.
    """
    booker_name = serializers.CharField(source="booker.username", read_only=True)
    booker_phone = serializers.CharField(source="booker.phone_number", read_only=True)
    vehicle_details = serializers.CharField(source="vehicle.__str__", read_only=True)
    amount = serializers.SerializerMethodField()
    
    class Meta:
        model = ServiceRequest
        fields = [
            "id", "service_type", "status", "priority", 
            "latitude", "longitude", "customer_notes", 
            "created_at", "booker_name", "booker_phone", "vehicle_details",
            "amount"
        ]

    def get_amount(self, obj):
        # Try to find a successful transaction first
        from apps.payments.models import Transaction
        tx = Transaction.objects.filter(service_request=obj, status='SUCCESS').first()
        if tx:
            return float(tx.amount)
        
        # Fallback to accepted quote
        quote = obj.quotes.filter(status="ACCEPTED").first()
        if quote:
            return float(quote.dynamic_total)
            
        return 0.0


class ChatMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source="sender.username", read_only=True)
    is_me = serializers.SerializerMethodField()

    class Meta:
        model = ChatMessage
        fields = ["id", "request", "sender", "sender_name", "message", "image", "is_read", "is_me", "created_at"]
        read_only_fields = ["id", "sender", "created_at"]

    def get_is_me(self, obj):
        request = self.context.get("request")
        if request and request.user:
            return obj.sender == request.user
        return False
class SparePartStoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = SparePartStore
        fields = "__all__"
