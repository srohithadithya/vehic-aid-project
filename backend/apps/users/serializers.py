from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import CustomUser, ServiceBooker, ServiceProvider, Notification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ("id", "title", "message", "is_read", "created_at")
        read_only_fields = ("id", "created_at")


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Customizes JWT payload to include user type and verification status."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token["is_booker"] = user.is_service_booker
        token["is_provider"] = user.is_service_provider

        if user.is_service_provider and hasattr(user, 'serviceprovider'):
            token["provider_verified"] = user.serviceprovider.is_verified

        return token


class BookerRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for customer (Service Booker) sign-up."""

    class Meta:
        model = CustomUser
        fields = ("username", "email", "phone_number", "password")
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email"),
            phone_number=validated_data.get("phone_number"),
            password=validated_data["password"],
            is_service_booker=True,
            is_service_provider=False,
        )
        # Create the corresponding ServiceBooker profile
        ServiceBooker.objects.create(user=user)
        return user


class ProviderRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for service provider sign-up (initial stage)."""

    bank_account_number = serializers.CharField(write_only=True)
    bank_ifsc_code = serializers.CharField(write_only=True)
    service_types = serializers.ListField(
        child=serializers.CharField(), write_only=True
    )

    class Meta:
        model = CustomUser
        fields = (
            "username",
            "email",
            "phone_number",
            "password",
            "bank_account_number",
            "bank_ifsc_code",
            "service_types",
        )
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        # Extract provider-specific details
        bank_account_number = validated_data.pop("bank_account_number")
        bank_ifsc_code = validated_data.pop("bank_ifsc_code")
        service_types = validated_data.pop("service_types")

        user = CustomUser.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email"),
            phone_number=validated_data.get("phone_number"),
            password=validated_data["password"],
            is_service_booker=False,
            is_service_provider=True,
        )
        # Create the corresponding ServiceProvider profile (starts unverified)
        ServiceProvider.objects.create(
            user=user,
            bank_account_number=bank_account_number,
            bank_ifsc_code=bank_ifsc_code,
            service_types=service_types,
            is_verified=False,  # Requires Admin approval
        )
        return user


class ProviderProfileUpdateSerializer(serializers.ModelSerializer):
    """Updates operational details for the provider."""

    latitude = serializers.DecimalField(max_digits=10, decimal_places=8)
    longitude = serializers.DecimalField(max_digits=10, decimal_places=8)
    is_available = serializers.BooleanField()

    class Meta:
        model = ServiceProvider
        fields = (
            "latitude",
            "longitude",
            "is_available",
            "average_rating",
            "jobs_completed",
        )
        read_only_fields = ("average_rating", "jobs_completed")

class ServiceBookerSerializer(serializers.ModelSerializer):
    """Serializer for customer (Service Booker) profile."""
    class Meta:
        model = ServiceBooker
        fields = ("preferred_language", "phone_number")
