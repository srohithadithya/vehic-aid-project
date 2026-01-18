from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ServiceBooker, ServiceProvider, Notification
from .serializers import (
    BookerRegistrationSerializer,
    ProviderProfileUpdateSerializer,
    ProviderRegistrationSerializer,
    ServiceBookerSerializer,
    NotificationSerializer
)


class NotificationViewSet(viewsets.ModelViewSet):
    """ViewSet for user notifications."""
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer
    queryset = Notification.objects.all()

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'], url_path='mark-all-read')
    def mark_all_read(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({"status": "All notifications marked as read"})

    @action(detail=True, methods=['post'], url_path='mark-read')
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({"status": "Notification marked as read"})


class BookerRegisterView(APIView):
    """Endpoint for new customer (Service Booker) registration."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = BookerRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "message": "Customer registered successfully. Please log in.",
                    "user_id": user.pk,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProviderRegisterView(APIView):
    """Endpoint for new service provider registration (initial data submission)."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ProviderRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "message": "Provider application submitted. Awaiting document verification.",
                    "user_id": user.pk,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProviderLocationUpdateView(APIView):
    """Endpoint for Service Providers to update their real-time location and availability."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Ensure the user is a Service Provider
            provider = request.user.serviceprovider
        except ServiceProvider.DoesNotExist:
            return Response(
                {"error": "Access denied. Not a Service Provider."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Check if verified status is required for updates (e.g., only verified providers can go online)
        if not provider.is_verified and request.data.get("is_available") is True:
            return Response(
                {"error": "Cannot go online. Profile requires admin verification."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = ProviderProfileUpdateSerializer(
            provider, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LanguagePreferenceView(APIView):
    """Endpoint for users (Bookers) to update their preferred language."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            booker = request.user.servicebooker
        except ServiceBooker.DoesNotExist:
            return Response({"error": "Only customers can set language preferences."}, status=status.HTTP_403_FORBIDDEN)
        
        lang = request.data.get('language')
        if not lang:
            return Response({"error": "Language required."}, status=status.HTTP_400_BAD_REQUEST)
        
        booker.preferred_language = lang
        booker.save()
        return Response({"message": "Language preference updated.", "language": lang})


class UserProfileView(APIView):
    """
    Handles fetching the profile data for the currently authenticated user (customer or provider).
    Endpoint used by the mobile app's ProfileScreen.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Base data structure
        response_data = {
            "id": user.pk,
            "full_name": f"{user.first_name} {user.last_name}",
            "email": user.email,
            "phone": user.phone_number,
            "is_provider": user.is_service_provider,
        }

        # Add provider-specific data
        if user.is_service_provider:
            try:
                provider = ServiceProvider.objects.get(user=user)
                from apps.services.models import Vehicle
                vehicles = Vehicle.objects.filter(owner=user).values_list('license_plate', flat=True)
                response_data.update(
                    {
                        "provider_id": f"PRO-{user.id:06d}",
                        "is_verified": provider.is_verified,
                        "average_rating": float(provider.average_rating),
                        "jobs_completed": provider.jobs_completed,
                        "is_available": provider.is_available,
                        "service_types": provider.service_types,
                        "vehicles": list(vehicles),
                        "bank_account": provider.bank_account_number,
                        "bank_ifsc": provider.bank_ifsc_code,
                        "server_time": timezone.now().isoformat(),
                    }
                )
            except ServiceProvider.DoesNotExist:
                pass

        # Add customer-specific data
        elif user.is_service_booker:
            booker = ServiceBooker.objects.get(user=user)
            from apps.services.models import UserSubscription
            sub = UserSubscription.objects.filter(user=booker, is_active=True).first()
            
            response_data.update(
                {
                    "preferred_language": booker.preferred_language,
                    "subscription_plan": sub.plan.name if sub else None,
                    "vehicles": [
                        v.license_plate for v in user.vehicles.all()
                    ],
                }
            )

        return Response({"user": response_data})

    def patch(self, request):
        """
        Updates the authenticated user's basic profile information (email, phone).
        """
        user = request.user
        data = request.data
        
        email = data.get('email')
        phone = data.get('phone')
        
        if email:
            user.email = email
        if phone:
            user.phone_number = phone
            
        user.save()
        
        # Determine if we need to update provider details (like banking)?
        # Assuming banking is read-only for now via this endpoint.
        
        return self.get(request)


class DeviceTokenView(APIView):
    """
    Endpoint for mobile apps to register their FCM device token.
    Used for push notifications.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({"error": "Token is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        user = request.user
        user.fcm_device_token = token
        user.save()
        
        return Response({"message": "Device token updated successfully"}, status=status.HTTP_200_OK)
