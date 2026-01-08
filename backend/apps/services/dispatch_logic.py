from math import atan2, cos, radians, sin, sqrt
import requests
import logging

from django.db import transaction
from django.db.models import ExpressionWrapper, F, fields
from django.conf import settings

from apps.users.models import ServiceProvider
from apps.services.models import ServiceQuote, UserSubscription
from decimal import Decimal
from datetime import timedelta
from django.utils import timezone
from apps.common.notifications import PushNotificationService

logger = logging.getLogger(__name__)

# Haversine formula to calculate great-circle distance between two points on a sphere.
def calculate_distance(lat1, lon1, lat2, lon2):
    """Returns distance in kilometers using Haversine algorithm."""
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

def get_real_distance(origin_lat, origin_lon, dest_lat, dest_lon):
    """
    Calculates distance using Google Maps Distance Matrix API if available,
    otherwise falls back to Haversine.
    """
    api_key = getattr(settings, 'GOOGLE_MAPS_API_KEY', None)
    
    if api_key:
        try:
            url = "https://maps.googleapis.com/maps/api/distancematrix/json"
            params = {
                "origins": f"{origin_lat},{origin_lon}",
                "destinations": f"{dest_lat},{dest_lon}",
                "key": api_key,
                "mode": "driving" # Assumes driving for roadside assistance
            }
            response = requests.get(url, params=params, timeout=5)
            data = response.json()
            
            if data['status'] == 'OK' and data['rows'][0]['elements'][0]['status'] == 'OK':
                # elements[0]['distance']['value'] is in meters
                meters = data['rows'][0]['elements'][0]['distance']['value']
                return meters / 1000.0 # Convert to km
                
        except Exception as e:
            logger.error(f"Google Maps API failed: {e}. Falling back to Haversine.")
            
    return calculate_distance(origin_lat, origin_lon, dest_lat, dest_lon)

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
    
    ranked_providers = []
    
    # We first do a pass with Haversine to roughly sort, then refine if needed.
    # For now, to save API calls in 'Day 1', we might stick to Haversine for sorting 
    # and use Real Matrix for the final quote, OR usage limit logic.
    # Let's use get_real_distance only for the top candidates if list is long?
    # Simple approach: Check all (if few) using real distance.
    
    for provider in available_providers:
        if provider.latitude and provider.longitude:
            # Use Haversine for initial ranking to avoid 100 API calls
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

    # Refine top 3 with real distance if API key present? 
    # For simplicity in this iteration, we keep the order but calculate real distance for the chosen one later.
    return ranked_providers[:3]

def generate_automated_quote(service_request, provider):
    """
    Automates the generation of a dynamic price quote.
    """
    # Use Real Distance for accurate pricing
    dist = get_real_distance(
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
        time_estimate_minutes=int(dist * 5) + 10, # dynamic time could also come from Google API
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
    
    # 4. Notify the Provider App (via Channels + FCM)
    # This notification is handled in the consumers.py file via a real-time event
    
    # Send Push Notification
    PushNotificationService.send_to_user(
        user=best_candidate.user,
        title="Valid Service Request",
        body=f"New {service_request.service_type} request nearby!",
        data={"request_id": str(service_request.id)}
    )

    return {
        "status": "DISPATCHED", 
        "provider_id": best_candidate.user_id,
        "quote_id": quote.id,
        "total_amount": quote.dynamic_total
    }
