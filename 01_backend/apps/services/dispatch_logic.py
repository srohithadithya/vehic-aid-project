from math import atan2, cos, radians, sin, sqrt

from django.db import transaction
from django.db.models import ExpressionWrapper, F, fields

from apps.users.models import ServiceProvider


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
            is_active=True,
            is_verified=True,  # Assuming a flag set during admin onboarding
            is_available=True,
        )
        .exclude(
            # Exclude providers who are not specialized for this service (simplified example)
            # In production, this checks array fields or ManyToMany fields
            service_types__contains=service_type
        )
        .annotate(
            # 2. Calculate Distance: Annotate the queryset with the calculated distance
            distance_km=ExpressionWrapper(
                # Placeholder for complex DB distance calculation
                F("id") * 0.0 + 1.0,
                output_field=fields.FloatField(),
            )
        )
        .order_by("distance_km")
    )  # 3. Rank: Sort by nearest first

    # In a real Django/PostGIS setup, a complex geographical function (ST_Distance) would replace the distance calculation placeholder.

    if not available_providers.exists():
        return None

    # Return the top 3 nearest providers to try dispatching
    return available_providers[:3]


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
    service_request.provider = best_candidate
    service_request.status = "PROVIDER_EN_ROUTE"
    service_request.save()

    # 3. Notify the Provider App (via Channels)
    # This notification is handled in the consumers.py file via a real-time event

    return {"status": "DISPATCHED", "provider_id": best_candidate.id}
