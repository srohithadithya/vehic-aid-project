from django.contrib.auth import get_user_model
from django.db.models import Count, Sum
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

# Local app imports
from apps.services.models import ServiceRequest
from apps.payments.models import Payment  # Transaction model alias
from apps.users.models import ServiceProvider

User = get_user_model()


@api_view(['GET'])
@permission_classes([IsAdminUser])
def dashboard_stats(request):
    """Return high‑level statistics for the admin dashboard."""
    # Users
    total_users = User.objects.count()
    total_customers = User.objects.filter(is_service_booker=True).count()
    total_providers = User.objects.filter(is_service_provider=True).count()

    # Service requests
    total_bookings = ServiceRequest.objects.count()
    pending_bookings = ServiceRequest.objects.filter(status='PENDING').count()
    completed_bookings = ServiceRequest.objects.filter(status='COMPLETED').count()

    # Revenue (successful payments)
    total_revenue = Payment.objects.filter(status='SUCCESS').aggregate(
        total=Sum('amount')
    )['total'] or 0

    # Active providers – verified and available
    active_providers = ServiceProvider.objects.filter(is_verified=True, is_available=True).count()

    return Response({
        'total_users': total_users,
        'total_customers': total_customers,
        'total_providers': total_providers,
        'total_bookings': total_bookings,
        'pending_bookings': pending_bookings,
        'completed_bookings': completed_bookings,
        'total_revenue': float(total_revenue),
        'active_providers': active_providers,
    })


@api_view(['GET'])
@permission_classes([IsAdminUser])
def recent_activity(request):
    """Return the most recent service requests for the admin dashboard."""
    recent = ServiceRequest.objects.select_related('booker', 'provider').order_by('-created_at')[:10]
    activity = []
    for req in recent:
        activity.append({
            'id': req.id,
            'type': 'booking',
            'description': f"New {req.service_type} request",
            'customer': req.booker.username if req.booker else 'Unknown',
            'status': req.status,
            'created_at': req.created_at.isoformat(),
        })
    return Response(activity)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def user_list(request):
    """Return a list of all users with basic profile info."""
    users = User.objects.all().order_by('-date_joined')
    data = []
    for u in users:
        role = 'CUSTOMER' if u.is_service_booker else ('PROVIDER' if u.is_service_provider else 'ADMIN')
        data.append({
            'id': u.id,
            'username': u.username,
            'email': u.email,
            'role': role,
            'phone_number': u.phone_number,
            'is_active': u.is_active,
            'date_joined': u.date_joined.isoformat(),
        })
    return Response(data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def service_request_list(request):
    """Return a detailed list of all service requests."""
    qs = ServiceRequest.objects.select_related('booker', 'provider', 'vehicle').order_by('-created_at')
    data = []
    for sr in qs:
        # Robust check for customer/provider name
        customer = 'Unknown'
        if sr.booker:
            if hasattr(sr.booker, 'username'):
                customer = sr.booker.username
            elif hasattr(sr.booker, 'user'):
                customer = sr.booker.user.username
        
        provider = 'Unassigned'
        if sr.provider:
            if hasattr(sr.provider, 'username'):
                provider = sr.provider.username
            elif hasattr(sr.provider, 'user'):
                provider = sr.provider.user.username

        data.append({
            'id': sr.id,
            'customer': customer,
            'provider': provider,
            'service_type': sr.service_type,
            'status': sr.status,
            'location': f"{sr.latitude}, {sr.longitude}",
            'latitude': float(sr.latitude) if sr.latitude else 0.0,
            'longitude': float(sr.longitude) if sr.longitude else 0.0,
            'customer_notes': sr.customer_notes or '',
            'priority': sr.priority,
            'created_at': sr.created_at.isoformat(),
            'description': sr.customer_notes or '',
        })
    return Response(data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def payment_list(request):
    """Return a list of all payment transactions."""
    qs = Payment.objects.select_related('booker', 'provider', 'service_request').order_by('-created_at')
    data = []
    for p in qs:
        # Payment -> Booker (Profile) -> User -> Username
        user_name = 'Unknown'
        if p.booker:
            if hasattr(p.booker, 'user'):
                user_name = p.booker.user.username
            elif hasattr(p.booker, 'username'):
                user_name = p.booker.username

        data.append({
            'id': p.id,
            'user': user_name,
            'amount': float(p.amount),
            'status': p.status,
            'payment_method': p.payment_method or 'RAZORPAY',
            'transaction_id': f"TRX-{p.id}",
            'created_at': p.created_at.isoformat(),
            'service_request_id': p.service_request.id if p.service_request else None,
        })
    return Response(data)
