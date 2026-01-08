from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.models import ServiceBooker, ServiceProvider
from django.db.models import Avg

from .dispatch_logic import trigger_dispatch
from .agent_logic import BookingAgent
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import timedelta
from .models import (
    ServiceRequest,
    Vehicle,
    SubscriptionPlan,
    UserSubscription,
    Review,
    VehicleExchange,
    HelplineCall,
    ServiceQuote,
)
from .serializers import (
    ServiceRequestSerializer,
    SubscriptionPlanSerializer,
    UserSubscriptionSerializer,
    SubscriptionCreateSerializer,
)




class AgenticBookingView(APIView):
    """
    Exposes the smart BookingAgent coordinator via a single endpoint.
    Ideal for 'One-Click' booking from mobile/IoT.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        agent = BookingAgent(request.user)
        # Expected data: latitude, longitude, service_type, description
        result = agent.process_booking(request.data)
        
        if result['status'] == 'SUCCESS':
            return Response(result, status=status.HTTP_201_CREATED)
        else:
            return Response(result, status=status.HTTP_202_ACCEPTED)

class ServiceRequestView(APIView):
    """Handles POST to create a new service request and GET to view status."""

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """Creates a new service request from the customer app."""
        serializer = ServiceRequestSerializer(data=request.data)

        if serializer.is_valid():
            # Ensure the vehicle belongs to the authenticated user
            vehicle = serializer.validated_data["vehicle"]
            if vehicle.owner != request.user:
                return Response(
                    {"error": "Vehicle does not belong to this user."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            # 1. Save request and link to user
            with transaction.atomic():
                service_request = serializer.save(
                    booker=request.user, priority="HIGH"
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

    def get(self, request, request_id=None, *args, **kwargs):
        """Retrieves the real-time status of an ongoing request OR lists recent requests."""
        # Ensure user is a booker
        if not hasattr(request.user, 'servicebooker'):
             return Response({"error": "User is not a registered service booker"}, status=status.HTTP_403_FORBIDDEN)

        booker = request.user.servicebooker

        if request_id:
            # Detail View
            service_request = get_object_or_404(
                ServiceRequest, id=request_id, booker=booker
            )
            return Response(
                {
                    "id": service_request.id,
                    "service_type": service_request.service_type,
                    "status": service_request.status,
                    "provider_id": service_request.provider_id,
                    "created_at": service_request.created_at,
                    "provider_location": None,  # TODO: Fetch real-time from cache
                }
            )
        else:
            # List View (Dashboard)
            requests = ServiceRequest.objects.filter(booker=booker).order_by('-created_at')[:20]
            # Use the existing serializer
            serializer = ServiceRequestSerializer(requests, many=True)
            return Response(serializer.data)


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
            # Attach the current user as the subscriber and set initial status
            validated = serializer.validated_data
            validated['user'] = request.user.servicebooker
            # API-created subscriptions should start as PENDING and inactive
            validated['status'] = 'PENDING'
            validated['is_active'] = False
            sub = UserSubscription.objects.create(**validated)
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



class DashboardStatsView(APIView):
    """
    Aggregates high-level operational metrics for the Admin Dashboard.
    """
    permission_classes = [IsAuthenticated] # In prod, restrict to Admin only

    def get(self, request):
        from apps.payments.models import Transaction, DailySettlement
        
        # 1. Booking Metrics
        total_requests = ServiceRequest.objects.count()
        active_requests = ServiceRequest.objects.filter(
            status__in=['REQUESTED', 'DISPATCHED', 'IN_PROGRESS']
        ).count()
        completed_today = ServiceRequest.objects.filter(
            status='COMPLETED',
            created_at__date=timezone.now().date()
        ).count()

        # 2. Provider Metrics
        total_providers = ServiceProvider.objects.count()
        online_providers = ServiceProvider.objects.filter(is_available=True).count()
        
        # 3. Financial Metrics (Total Platform Revenue)
        # Sum of all successful transactions
        total_revenue = Transaction.objects.filter(
            status='SUCCESS'
        ).aggregate(total=Sum('amount'))['total'] or 0

        # 4. Recent Activity (Last 5 requests)
        # 4. Recent Activity (Last 5 requests)
        recent_requests_qs = ServiceRequest.objects.order_by('-created_at')[:5].values(
            'id', 'service_type', 'status', 'created_at', 'booker__username'
        )
        
        recent_activity_data = []
        for r in recent_requests_qs:
            recent_activity_data.append({
                "id": r['id'],
                "type": r['service_type'],
                "description": f"New {r['service_type']} request",
                "customer": r['booker__username'],
                "status": r['status'],
                "created_at": r['created_at']
            })

        return Response({
            "bookings": {
                "total": total_requests,
                "active": active_requests,
                "completed_today": completed_today
            },
            "providers": {
                "total": total_providers,
                "online": online_providers
            },
            "financials": {
                "total_revenue": total_revenue
            },
            "recent_activity": recent_activity_data
        })

class SubscriptionAnalyticsView(APIView):
    """
    Automated reporting for subscription health and revenue.
    """
    permission_classes = [IsAuthenticated] # Should be Admin, but for test IsAuthenticated

    def get(self, request, *args, **kwargs):
        # 1. Basic Counts
        total_active = UserSubscription.objects.filter(is_active=True).count()
        expiring_soon = UserSubscription.objects.filter(
            is_active=True, 
            end_date__lte=timezone.now() + timedelta(days=7)
        ).count()
        
        # 2. Plan Popularity
        plan_stats = SubscriptionPlan.objects.annotate(
            active_users=Count('subscriptions', filter=Q(subscriptions__is_active=True))
        ).values('name', 'active_users')
        
        # 3. Simulated Revenue (Sum of prices of all active subscriptions)
        total_mrr = UserSubscription.objects.filter(is_active=True).aggregate(
            mrr=Sum('plan__price')
        )['mrr'] or 0
        
        return Response({
            "total_active_subscriptions": total_active,
            "expiring_within_7_days": expiring_soon,
            "monthly_recurring_revenue": total_mrr,
            "plan_breakdown": list(plan_stats),
            "timestamp": timezone.now()
        })


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

    def perform_create(self, serializer):
        """
        Validate eligibility before creating an exchange request.
        User must have a subscription plan that supports 'is_exchange_eligible'.
        """
        user = self.request.user.servicebooker
        # Check for active subscription with exchange eligibility
        active_sub = UserSubscription.objects.filter(
            user=user, 
            is_active=True, 
            plan__is_exchange_eligible=True
        ).first()

        if not active_sub:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Your current subscription does not support Vehicle Exchange.")
            
        serializer.save()
    
    @action(detail=True, methods=['post'], url_path='provide')
    def provide_rental(self, request, pk=None):
        """Provider marks that the rental vehicle has been handed over."""
        exchange = self.get_object()
        # Verify user is a provider or admin (simple check)
        if hasattr(request.user, 'servicebooker'):
             return Response({"error": "Only providers can perform this action."}, status=status.HTTP_403_FORBIDDEN)
        
        exchange.status = 'PROVIDED'
        exchange.save()
        return Response({"status": "Rental vehicle provided.", "exchange_status": exchange.status})

    @action(detail=True, methods=['post'], url_path='complete')
    def complete_exchange(self, request, pk=None):
        """Mark exchange as completed (Rental returned, Original retrieved)."""
        exchange = self.get_object()
        exchange.status = 'COMPLETED'
        exchange.save()
        return Response({"status": "Exchange completed successfully."})


class ServiceQuoteViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only viewset for quotes (Quotes are generated by the system, not users).
    Users can Accept or Reject them.
    """
    permission_classes = [IsAuthenticated]
    queryset = ServiceQuote.objects.all()
    
    def get_serializer_class(self):
        from .serializers import ServiceQuoteSerializer
        return ServiceQuoteSerializer
    
    def get_queryset(self):
         user = self.request.user
         if hasattr(user, 'servicebooker'):
             return ServiceQuote.objects.filter(request__booker=user.servicebooker)
         return ServiceQuote.objects.none()

    @action(detail=True, methods=['post'], url_path='accept')
    def accept_quote(self, request, pk=None):
        quote = self.get_object()
        if quote.status != 'PENDING':
             return Response({"error": "Quote is already processed."}, status=status.HTTP_400_BAD_REQUEST)
        
        quote.status = 'ACCEPTED'
        quote.save()
        
        # Logic to proceed with service (e.g., notify provider)
        # In a real system, this might trigger a payment intent creation
        
        return Response({"status": "Quote accepted. Service will proceed.", "dynamic_total": quote.dynamic_total})

    @action(detail=True, methods=['post'], url_path='reject')
    def reject_quote(self, request, pk=None):
        quote = self.get_object()
        if quote.status != 'PENDING':
             return Response({"error": "Quote is already processed."}, status=status.HTTP_400_BAD_REQUEST)
        
        quote.status = 'REJECTED'
        quote.save()
        
        # Logic to cancel service request or request re-quote
        
        return Response({"status": "Quote rejected."})


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

    @action(detail=False, methods=['post'], url_path='submit-referral')
    def submit_referral(self, request):
        """Submit a referral code from another user."""
        from .models import RewardsProgram
        code = request.data.get('code')
        if not code:
            return Response({"error": "Referral code required"}, status=status.HTTP_400_BAD_REQUEST)
        
        referrer = RewardsProgram.objects.filter(referral_code=code).first()
        if not referrer:
            return Response({"error": "Invalid referral code"}, status=status.HTTP_400_BAD_REQUEST)
        
        if referrer.user == request.user.servicebooker:
            return Response({"error": "Cannot refer yourself"}, status=status.HTTP_400_BAD_REQUEST)
            
        # 1. Reward both parties
        referrer.add_points(500, f"Referral successful: {request.user.username}")
        referrer.referrals_made += 1
        referrer.save()
        
        me, created = RewardsProgram.objects.get_or_create(user=request.user.servicebooker)
        if not me.referral_code:
            me.generate_referral_code()
        me.add_points(200, "Referral bonus for joining")
        
        # 2. Track Referral relationship
        from .models import Referral
        Referral.objects.create(
            referrer=referrer.user,
            referred_user=request.user.servicebooker,
            reward_points=500
        )
        
        return Response({"message": "Referral successful! Points awarded to both."})

    @action(detail=False, methods=['get'], url_path='list-referrals')
    def list_referrals(self, request):
        """List users referred by the current user."""
        from .models import Referral
        referrals = Referral.objects.filter(referrer=request.user.servicebooker)
        data = [{
            "referred_user": r.referred_user.user.username,
            "reward_points": r.reward_points,
            "date": r.created_at
        } for r in referrals]
        return Response(data)
    
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



class VehicleViewSet(viewsets.ModelViewSet):
    "CRUD for user vehicles."
    permission_classes = [IsAuthenticated]
    queryset = Vehicle.objects.all()

    def get_serializer_class(self):
        from .serializers import VehicleSerializer
        return VehicleSerializer

    def get_queryset(self):
        "Users can only see their own vehicles."
        if hasattr(self.request.user, 'servicebooker'):
             return Vehicle.objects.filter(owner=self.request.user)
        return Vehicle.objects.none()


class ProviderJobView(viewsets.ViewSet):
    """
    Endpoints for providers to find and accept jobs.
    """
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """List all open requests available for pickup."""
        # Using 'REQUESTED' as the status for open jobs
        jobs = ServiceRequest.objects.filter(status='REQUESTED').order_by('-created_at')
        from .serializers import ServiceRequestSerializer
        serializer = ServiceRequestSerializer(jobs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        """Provider accepts a job."""
        job = get_object_or_404(ServiceRequest, pk=pk)
        
        if job.status != 'REQUESTED':
             return Response({"error": "Job is no longer available."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if provider is available
        provider = getattr(request.user, 'serviceprovider', None)
        if not provider:
             return Response({"error": "User is not a service provider."}, status=status.HTTP_403_FORBIDDEN)

        job.provider = provider
        job.status = 'IN_PROGRESS' # or 'DISPATCHED'
        job.save()
        
        return Response({"status": "Job accepted", "job_id": job.id})


class AIStatsView(APIView):
    """
    Endpoint for AI Monitor analytics.
    Aggregates conversational triage stats and machine learning health.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # In a real system, these would be aggregated from a ConversationLog model
        # For MVP, we simulate dynamic data based on recent ServiceRequests
        
        total_requests = ServiceRequest.objects.count()
        auto_booked = ServiceRequest.objects.filter(customer_notes__icontains="auto").count()
        
        # Simulate accuracy fluctuation
        base_accuracy = 96.0
        
        return Response({
            "total_sessions": total_requests * 5 + 120, # Mock: 5 interactions per request + browsing
            "auto_booking_rate": round((auto_booked / (total_requests or 1)) * 100, 1) or 64.2,
            "triage_accuracy": base_accuracy,
            "triage_data": [
                 { "name": 'Mechanical', "count": 450, "accuracy": 94 },
                 { "name": 'Towing', "count": 320, "accuracy": 98 },
                 { "name": 'Battery', "count": 280, "accuracy": 92 },
                 { "name": 'Fuel', "count": 120, "accuracy": 100 },
            ],
            "load_data": [
                { "time": '08:00', "requests": 12 },
                { "time": '10:00', "requests": 45 },
                { "time": '12:00', "requests": 68 },
                { "time": '14:00', "requests": 52 },
                { "time": '16:00', "requests": 89 },
                { "time": '18:00', "requests": 74 },
                { "time": '20:00', "requests": 31 },
                { "time": '22:00', "requests": 15 },
            ]
        })

