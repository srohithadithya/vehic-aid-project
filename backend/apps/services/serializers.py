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
)


class VehicleSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Vehicle
        fields = ["id", "license_plate", "make", "model", "fuel_type", "owner"]
        read_only_fields = ["id", "owner"]


class ServiceRequestSerializer(serializers.ModelSerializer):
    # Field to allow the user to submit a specific vehicle ID
    vehicle_id = serializers.PrimaryKeyRelatedField(
        queryset=Vehicle.objects.all(), write_only=True, required=True, source="vehicle"
    )

    class Meta:
        model = ServiceRequest
        fields = [
            "id",
            "vehicle_id",
            "service_type",
            "customer_notes",
            "latitude",
            "longitude",
            "status",
            "priority",
        ]
        read_only_fields = ["id", "status", "priority"]


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
        ]
        read_only_fields = ["id", "created_at"]


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["id", "request", "booker", "provider", "rating", "comment", "created_at"]
        read_only_fields = ["id", "created_at"]


class VehicleExchangeSerializer(serializers.ModelSerializer):
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
    
    class Meta:
        model = ServiceRequest
        fields = [
            "id", "service_type", "status", "priority", 
            "latitude", "longitude", "customer_notes", 
            "booker_name", "booker_phone", "vehicle_details",
            "created_at"
        ]
