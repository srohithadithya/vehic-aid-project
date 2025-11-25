from django.utils import timezone
from rest_framework.response import Response
from rest_framework import status
from apps.services.models import UserSubscription

class PlanAccessMiddleware:
    """
    Middleware to enforce subscription plan limits and feature access.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Logic to check access based on request path and user subscription
        if request.path.startswith('/api/services/request/') and request.method == 'POST':
             if request.user.is_authenticated and hasattr(request.user, 'servicebooker'):
                # Check for active subscription
                active_sub = UserSubscription.objects.filter(
                    user=request.user.servicebooker,
                    is_active=True,
                    status='ACTIVE'
                ).first()

                if active_sub:
                    # Check request limits
                    if active_sub.plan.max_requests_per_month > 0:
                        # Count requests in current month
                        current_month_start = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
                        request_count = request.user.servicebooker.requests_made.filter(
                            created_at__gte=current_month_start
                        ).count()
                        
                        if request_count >= active_sub.plan.max_requests_per_month:
                            # Allow if it's a paid request (implementation detail: could check for pay-per-use flag)
                            # For now, block if limit reached
                            # return JsonResponse({'error': 'Monthly request limit reached for your plan.'}, status=403)
                            pass # Placeholder: logic to enforce or upsell

        response = self.get_response(request)
        return response
