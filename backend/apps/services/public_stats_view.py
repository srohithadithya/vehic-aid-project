from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from django.db.models import Avg
from apps.users.models import ServiceBooker, ServiceProvider
from .models import Review
import logging

logger = logging.getLogger(__name__)


class PublicStatsRateThrottle(AnonRateThrottle):
    """Rate limiting for public stats endpoint - 100 requests per hour per IP"""
    rate = '100/hour'


class PublicStatsView(APIView):
    """
    Publicly accessible stats for the landing page.
    Rate limited to 100 requests per hour per IP address.
    """
    permission_classes = []  # Public access
    throttle_classes = [PublicStatsRateThrottle]

    def get(self, request):
        from django.core.cache import cache
        cache_key = 'public_stats_data'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response(cached_data)

        # 1. Real-time Customer Count
        total_customers = ServiceBooker.objects.count()
        
        # 2. Real-time Verified Providers
        total_providers = ServiceProvider.objects.filter(is_verified=True).count()

        # 3. Dynamic Satisfaction Rate
        try:
            avg_rating = Review.objects.aggregate(avg=Avg('rating'))['avg']
            satisfaction_rate = int((float(avg_rating) / 5) * 100) if avg_rating is not None else 98
        except Exception:
            satisfaction_rate = 98

        avg_response_min = 12

        response_data = {
            "customers": f"{total_customers}+",
            "providers": f"{total_providers}+",
            "satisfaction": f"{satisfaction_rate}%",
            "response_time": f"{avg_response_min} min"
        }
        
        # Cache for performance
        cache.set(cache_key, response_data, 300)
        return Response(response_data)
