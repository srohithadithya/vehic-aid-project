from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.models import ServiceBooker, ServiceProvider

from .dispatch_logic import trigger_dispatch
from .models import (
    ServiceRequest,
    SubscriptionPlan,
    UserSubscription,
    Review,
    VehicleExchange,
    HelplineCall,
)
from .serializers import (
    ServiceRequestSerializer,
    SubscriptionPlanSerializer,
    UserSubscriptionSerializer,
    SubscriptionCreateSerializer,
)


class ServiceRequestView(APIView):
    """Handles POST to create a new service request and GET to view status."""

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """Creates a new service request from the customer app."""
        serializer = ServiceRequestSerializer(data=request.data)

        if serializer.is_valid():
            # Ensure the vehicle belongs to the authenticated user
            vehicle = serializer.validated_data["vehicle"]
            if vehicle.owner != request.user.servicebooker:  # Assumes user is a ServiceBooker
                return Response(
                    {"error": "Vehicle does not belong to this user."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            # 1. Save request and link to user
            with transaction.atomic():
                service_request = serializer.save(
                    booker=request.user.servicebooker, priority="HIGH"
                )

                # 2. Trigger the automated dispatch process
                dispatch_result = trigger_dispatch(service_request)

            return Response(
                {
                    "id": service_request.id,
                    "status": dispatch_result["status"],
                    "message": "Service requested and dispatch initiated.",
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, request_id, *args, **kwargs):
        """Retrieves the real-time status of an ongoing request."""
        booker = request.user.servicebooker
        service_request = get_object_or_404(
            ServiceRequest, id=request_id, booker=booker
        )

        return Response(
            {
                "id": service_request.id,
                "status": service_request.status,
                "provider_id": service_request.provider_id,
                "provider_location": "...",  # Real-time data from cache/Channels
            }
        )


class ProviderStatusUpdateView(APIView):
    """Endpoint for the provider app to update job status (e.g., Arrived, Completed)."""

    permission_classes = [IsAuthenticated]  # Requires ServiceProvider Authentication

    def post(self, request, request_id, *args, **kwargs):
        provider = request.user.serviceprovider  # Assumes user is a ServiceProvider
        new_status = request.data.get("status")

        service_request = get_object_or_404(
            ServiceRequest, id=request_id, provider=provider
        )

        if new_status not in dict(ServiceRequest.STATUS_CHOICES):
            return Response(
                {"error": "Invalid status value."}, status=status.HTTP_400_BAD_REQUEST
            )

        if new_status == "COMPLETED":
            # Completion requires payment confirmation which is handled by the payments app webhook
            return Response(
                {
                    "error": "Cannot set status to COMPLETED via API. Awaiting payment confirmation."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        service_request.status = new_status
        service_request.save()

        # Notify customer via Channels/Push Notification
        # send_status_update_to_customer(service_request)

        return Response(
            {
                "id": service_request.id,
                "status": new_status,
                "message": "Status updated successfully.",
            }
        )


class SubscriptionViewSet(viewsets.ViewSet):
    """CRUD-like endpoints for managing user subscriptions."""

    permission_classes = [IsAuthenticated]
    queryset = UserSubscription.objects.all()

    def list(self, request):
        """List all subscriptions for the authenticated user."""
        subs = UserSubscription.objects.filter(user=request.user.servicebooker)
        serializer = UserSubscriptionSerializer(subs, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """Retrieve a specific subscription by ID."""
        sub = get_object_or_404(UserSubscription, pk=pk, user=request.user.servicebooker)
        serializer = UserSubscriptionSerializer(sub)
        return Response(serializer.data)

    def create(self, request):
        """Subscribe the user to a plan.
        Expected payload: {"plan": <plan_id>, "auto_renew": true/false}
        """
        serializer = SubscriptionCreateSerializer(data=request.data)
        if serializer.is_valid():
            # Attach the current user as the subscriber
            sub = serializer.save(user=request.user.servicebooker)
            out_serializer = UserSubscriptionSerializer(sub)
            return Response(out_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"], url_path="cancel")
    def cancel(self, request, pk=None):
        """Cancel an active subscription."""
        sub = get_object_or_404(UserSubscription, pk=pk, user=request.user.servicebooker)
        if sub.status != "ACTIVE":
            return Response({"error": "Only active subscriptions can be cancelled."}, status=status.HTTP_400_BAD_REQUEST)
        sub.cancel()
        return Response({"status": "CANCELLED", "message": "Subscription cancelled."})

    @action(detail=True, methods=["post"], url_path="renew")
    def renew(self, request, pk=None):
        """Renew an expired or cancelled subscription (if auto_renew is enabled)."""
        sub = get_object_or_404(UserSubscription, pk=pk, user=request.user.servicebooker)
        if not sub.auto_renew:
            return Response({"error": "Auto‑renew is not enabled for this subscription."}, status=status.HTTP_400_BAD_REQUEST)
        sub.renew()
        return Response({"status": sub.status, "message": "Subscription renewed."})

    @action(detail=False, methods=["get"], url_path="current")
    def current(self, request):
        """Return the currently active subscription, if any."""
        sub = UserSubscription.objects.filter(user=request.user.servicebooker, is_active=True).first()
        if not sub:
            return Response({"detail": "No active subscription."}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSubscriptionSerializer(sub)
        return Response(serializer.data)


class ReviewViewSet(viewsets.ModelViewSet):
    """CRUD endpoints for service reviews."""
    permission_classes = [IsAuthenticated]
    queryset = Review.objects.all()
    
    def get_serializer_class(self):
        from .serializers import ReviewSerializer
        return ReviewSerializer
    
    def get_queryset(self):
        """Filter reviews based on user role."""
        user = self.request.user
        if hasattr(user, 'servicebooker'):
            # Bookers see their own reviews
            return Review.objects.filter(booker=user.servicebooker)
        elif hasattr(user, 'serviceprovider'):
            # Providers see reviews about them
            return Review.objects.filter(provider=user.serviceprovider)
        return Review.objects.none()
    
    def create(self, request):
        """Create a review for a completed service."""
        from .serializers import ReviewSerializer
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            # Ensure the request belongs to the user
            service_request = serializer.validated_data['request']
            if service_request.booker != request.user.servicebooker:
                return Response(
                    {"error": "You can only review your own service requests."},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Check if request is completed
            if service_request.status != 'COMPLETED':
                return Response(
                    {"error": "Can only review completed services."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            review = serializer.save(
                booker=request.user.servicebooker,
                provider=service_request.provider.serviceprovider
            )
            
            # Update provider's average rating
            provider = service_request.provider.serviceprovider
            avg_rating = Review.objects.filter(provider=provider).aggregate(
                Avg('rating')
            )['rating__avg']
            provider.average_rating = round(avg_rating, 2)
            provider.save()
            
            return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VehicleExchangeViewSet(viewsets.ModelViewSet):
    """CRUD endpoints for vehicle exchange requests."""
    permission_classes = [IsAuthenticated]
    queryset = VehicleExchange.objects.all()
    
    def get_serializer_class(self):
        from .serializers import VehicleExchangeSerializer
        return VehicleExchangeSerializer
    
    def get_queryset(self):
        """Filter exchanges for current user."""
        user = self.request.user
        if hasattr(user, 'servicebooker'):
            return VehicleExchange.objects.filter(
                request__booker=user.servicebooker
            )
        return VehicleExchange.objects.all()
    
    @action(detail=True, methods=['post'], url_path='complete')
    def complete_exchange(self, request, pk=None):
        """Mark exchange as completed."""
        exchange = self.get_object()
        exchange.status = 'COMPLETED'
        exchange.save()
        return Response({"status": "Exchange completed successfully."})


class WalletViewSet(viewsets.ViewSet):
    """Wallet management endpoints."""
    permission_classes = [IsAuthenticated]
    
    def retrieve(self, request, pk=None):
        """Get wallet balance and details."""
        from .models import Wallet
        from .serializers import WalletSerializer
        
        wallet, created = Wallet.objects.get_or_create(user=request.user.servicebooker)
        serializer = WalletSerializer(wallet)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], url_path='add-money')
    def add_money(self, request):
        """Add money to wallet."""
        from .models import Wallet
        from decimal import Decimal
        
        amount = Decimal(request.data.get('amount', 0))
        if amount <= 0:
            return Response(
                {"error": "Amount must be greater than 0"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        wallet, created = Wallet.objects.get_or_create(user=request.user.servicebooker)
        wallet.add_money(amount, f"Added ₹{amount} to wallet")
        
        return Response({
            "message": f"₹{amount} added successfully",
            "new_balance": wallet.balance
        })
    
    @action(detail=False, methods=['get'], url_path='transactions')
    def transactions(self, request):
        """Get wallet transaction history."""
        from .models import Wallet, WalletTransaction
        from .serializers import WalletTransactionSerializer
        
        wallet, created = Wallet.objects.get_or_create(user=request.user.servicebooker)
        transactions = WalletTransaction.objects.filter(wallet=wallet).order_by('-created_at')[:50]
        serializer = WalletTransactionSerializer(transactions, many=True)
        return Response(serializer.data)


class RewardsViewSet(viewsets.ViewSet):
    """Rewards program endpoints."""
    permission_classes = [IsAuthenticated]
    
    def retrieve(self, request, pk=None):
        """Get rewards program details."""
        from .models import RewardsProgram
        from .serializers import RewardsProgramSerializer
        
        rewards, created = RewardsProgram.objects.get_or_create(user=request.user.servicebooker)
        if created:
            rewards.generate_referral_code()
        
        serializer = RewardsProgramSerializer(rewards)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], url_path='redeem')
    def redeem_points(self, request):
        """Redeem reward points for wallet cash."""
        from .models import RewardsProgram
        
        points = int(request.data.get('points', 0))
        if points < 100:
            return Response(
                {"error": "Minimum 100 points required for redemption"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        rewards, created = RewardsProgram.objects.get_or_create(user=request.user.servicebooker)
        
        if rewards.redeem_points(points):
            cash_value = points * 0.10
            return Response({
                "message": f"{points} points redeemed for ₹{cash_value}",
                "remaining_points": rewards.points,
                "tier": rewards.tier
            })
        else:
            return Response(
                {"error": "Insufficient points"},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['get'], url_path='transactions')
    def transactions(self, request):
        """Get reward transaction history."""
        from .models import RewardsProgram, RewardTransaction
        from .serializers import RewardTransactionSerializer
        
        rewards, created = RewardsProgram.objects.get_or_create(user=request.user.servicebooker)
        transactions = RewardTransaction.objects.filter(
            rewards_program=rewards
        ).order_by('-created_at')[:50]
        serializer = RewardTransactionSerializer(transactions, many=True)
        return Response(serializer.data)


class HelplineCallViewSet(viewsets.ModelViewSet):
    """CRUD endpoints for helpline calls."""
    permission_classes = [IsAuthenticated]
    queryset = HelplineCall.objects.all()
    
    def get_serializer_class(self):
        from .serializers import HelplineCallSerializer
        return HelplineCallSerializer
    
    def get_queryset(self):
        """Filter calls for current user."""
        user = self.request.user
        if hasattr(user, 'servicebooker'):
            return HelplineCall.objects.filter(caller=user.servicebooker)
        elif hasattr(user, 'serviceprovider'):
            return HelplineCall.objects.filter(operator=user.serviceprovider)
        return HelplineCall.objects.all()

