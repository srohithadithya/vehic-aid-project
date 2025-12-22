from math import atan2, cos, radians, sin, sqrt

from django.db import transaction
from django.db.models import ExpressionWrapper, F, fields

from apps.users.models import ServiceProvider
from apps.services.models import ServiceQuote, UserSubscription
from decimal import Decimal
from datetime import timedelta
from django.utils import timezone


# Haversine formula to calculate great-circle distance between two points on a sphere.
def calculate_distance(lat1, lon1, lat2, lon2):
    """Returns distance in kilometers."""
    R = 6371  # Radius of Earth in kilometers

    lat1_rad = radians(lat1)
    lon1_rad = radians(lon1)
    lat2_rad = radians(lat2)
    lon2_rad = radians(lon2)

    dlon = lon2_rad - lon1_rad
    dlat = lat2_rad - lat1_rad

    a = sin(dlat / 2) ** 2 + cos(lat1_rad) * cos(lat2_rad) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return R * c


def find_nearest_available_provider(service_request):
    """
    Finds and ranks available providers based on distance and service compatibility.
    """
    request_lat = service_request.latitude
    request_lon = service_request.longitude
    service_type = service_request.service_type

    # 1. Filter: Get only available providers who are verified.
    available_providers = (
        ServiceProvider.objects.filter(
            is_verified=True,
            is_available=True,
        )
    )
    
    # In a real setup with PostGIS, we'd use ST_Distance.
    # Here we'll do a python-side ranking if the list isn't massive, 
    # or a simplified bounding box check first.
    
    ranked_providers = []
    for provider in available_providers:
        if provider.latitude and provider.longitude:
            dist = calculate_distance(
                request_lat, request_lon, 
                float(provider.latitude), float(provider.longitude)
            )
            provider.distance_km = dist
            ranked_providers.append(provider)
            
    # Sort by distance
    ranked_providers.sort(key=lambda x: x.distance_km)

    if not ranked_providers:
        return None

    # Return the top 3 nearest providers
    return ranked_providers[:3]

def generate_automated_quote(service_request, provider):
    """
    Automates the generation of a dynamic price quote.
    """
    dist = calculate_distance(
        service_request.latitude, service_request.longitude,
        float(provider.latitude), float(provider.longitude)
    )
    
    # Calculate total
    base_price = Decimal("250.00")
    price_per_km = Decimal("40.00")
    total = base_price + (Decimal(str(dist)) * price_per_km)

    # 1. Automation: Apply Subscription Discounts
    # Check if user has an active subscription
    sub = UserSubscription.objects.filter(user__user=service_request.booker, is_active=True).first()
    if sub:
        if sub.plan.name == 'Gold':
            total = Decimal("0.00") # Gold users get free service
        elif sub.plan.name == 'Premium':
            total *= Decimal("0.5") # Premium users get 50% off
            
    quote = ServiceQuote.objects.create(
        request=service_request,
        base_price=base_price,
        distance_km=dist,
        time_estimate_minutes=int(dist * 5) + 10,
        dynamic_total=total,
        status="PENDING",
        valid_until=timezone.now() + timedelta(minutes=30)
    )
    return quote


@transaction.atomic
def trigger_dispatch(service_request):
    """
    Coordinates the dispatch attempt to the nearest provider(s).
    """
    # 1. Find candidates
    candidates = find_nearest_available_provider(service_request)

    if not candidates:
        # No providers available, notify Helpline UI via Channels
        return {"status": "NO_PROVIDER", "message": "No nearby providers available."}

    # 2. Attempt dispatch to the best candidate
    best_candidate = candidates[0]

    # Assign provider and update request status
    service_request.provider = best_candidate.user
    service_request.status = "DISPATCHED"
    service_request.save()

    # 3. Automation: Generate dynamic price quote
    quote = generate_automated_quote(service_request, best_candidate)
    
    # 4. Notify the Provider App (via Channels)
    # This notification is handled in the consumers.py file via a real-time event

    return {
        "status": "DISPATCHED", 
        "provider_id": best_candidate.user_id,
        "quote_id": quote.id,
        "total_amount": quote.dynamic_total
    }
