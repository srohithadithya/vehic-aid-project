from django.shortcuts import render
from django.contrib.auth.decorators import login_required, user_passes_test
from django.db.models import Count, Sum, Avg
from django.utils import timezone
from datetime import timedelta

from apps.services.models import (
    ServiceRequest, UserSubscription, Review,
    Wallet, RewardsProgram
)


def is_admin(user):
    """Check if user is admin/staff."""
    return user.is_staff or user.is_superuser


@login_required
@user_passes_test(is_admin)
def dashboard(request):
    """
    Main admin dashboard with statistics and overview.
    """
    # Get date range for statistics
    today = timezone.now()
    last_month = today - timedelta(days=30)
    
    # Calculate statistics
    total_requests = ServiceRequest.objects.count()
    active_subscriptions = UserSubscription.objects.filter(
        is_active=True, status='ACTIVE'
    ).count()
    
    # Revenue calculation (from completed requests)
    from apps.payments.models import Transaction
    total_revenue = Transaction.objects.filter(status='SUCCESS').aggregate(
        total=Sum('amount')
    )['total'] or 0
    
    # Average rating
    avg_rating = Review.objects.aggregate(Avg('rating'))['rating__avg'] or 0.0
    
    # Recent requests
    recent_requests = ServiceRequest.objects.select_related(
        'booker', 'provider'
    ).order_by('-created_at')[:5]
    
    # --- Charts Data Preparation ---
    from django.db.models.functions import TruncDay
    import json
    from django.core.serializers.json import DjangoJSONEncoder

    # 1. Service Trends (Last 30 Days Daily) - Zero Filled
    trends_queryset = ServiceRequest.objects.filter(
        created_at__gte=last_month
    ).annotate(
        day=TruncDay('created_at')
    ).values('day').annotate(
        count=Count('id')
    ).order_by('day')
    
    # Convert queryset to dict for easy lookup
    trends_dict = {}
    for entry in trends_queryset:
        if entry['day']:
            # Normalize to date object for comparison if needed, or keep as datetime
            # TruncDay returns datetime
            trends_dict[entry['day'].date()] = entry['count']

    months_labels = []
    trends_data = []
    
    # Generate all days for last 30 days
    current_date = last_month.date()
    end_date = today.date()
    
    while current_date <= end_date:
        months_labels.append(current_date.strftime('%d %b'))
        # Get count from dict or 0
        count = trends_dict.get(current_date, 0)
        trends_data.append(count)
        current_date += timedelta(days=1)
            
    # 2. Service Distribution
    dist_queryset = ServiceRequest.objects.values('service_type').annotate(
        count=Count('id')
    ).order_by('-count')
    
    dist_labels = [item['service_type'] for item in dist_queryset]
    dist_data = [item['count'] for item in dist_queryset]

    # Package all into a JSON-serializable context
    chart_data = {
        'trends': {
            'labels': months_labels,
            'data': trends_data
        },
        'distribution': {
            'labels': dist_labels,
            'data': dist_data
        }
    }

    context = {
        'total_requests': total_requests,
        'active_subscriptions': active_subscriptions,
        'total_revenue': total_revenue,
        'avg_rating': round(avg_rating, 1),
        'recent_requests': recent_requests,
        'chart_data': json.dumps(chart_data, cls=DjangoJSONEncoder),
    }
    
    return render(request, 'admin/dashboard.html', context)


@login_required
@user_passes_test(is_admin)
def subscriptions_view(request):
    """View all subscriptions."""
    subscriptions = UserSubscription.objects.select_related(
        'user', 'plan'
    ).order_by('-created_at')
    
    context = {
        'subscriptions': subscriptions,
    }
    
    return render(request, 'admin/subscriptions.html', context)


@login_required
@user_passes_test(is_admin)
def service_requests_view(request):
    """View all service requests."""
    requests = ServiceRequest.objects.select_related(
        'booker', 'provider'
    ).order_by('-created_at')
    
    context = {
        'requests': requests,
    }
    
    return render(request, 'admin/service_requests.html', context)


@login_required
@user_passes_test(is_admin)
def wallet_transactions_view(request):
    """View wallet transactions."""
    from apps.services.models import WalletTransaction
    
    transactions = WalletTransaction.objects.select_related(
        'wallet__user'
    ).order_by('-created_at')[:100]
    
    context = {
        'transactions': transactions,
    }
    
    return render(request, 'admin/wallet_transactions.html', context)


@login_required
@user_passes_test(is_admin)
def rewards_view(request):
    """View rewards program statistics."""
    rewards = RewardsProgram.objects.select_related('user').order_by('-points')[:50]
    
    context = {
        'rewards': rewards,
    }
    
    return render(request, 'admin/rewards.html', context)


@login_required
@user_passes_test(is_admin)
def providers_view(request):
    """View all service providers."""
    from apps.users.models import ServiceProvider
    
    providers = ServiceProvider.objects.select_related('user').order_by('-average_rating')
    
    context = {
        'providers': providers,
    }
    
    return render(request, 'admin/providers.html', context)


@login_required
@user_passes_test(is_admin)
def reviews_view(request):
    """View all system reviews."""
    reviews = Review.objects.select_related(
        'booker', 'provider', 'request'
    ).order_by('-created_at')
    
    context = {
        'reviews': reviews,
    }
    
    return render(request, 'admin/reviews.html', context)


@login_required
@user_passes_test(is_admin)
def helpline_view(request):
    """View helpline calls and issue tracking."""
    from apps.services.models import HelplineCall
    
    # Fetch recent helpline calls
    recent_calls = HelplineCall.objects.select_related(
        'caller', 'operator', 'linked_service_request'
    ).order_by('-call_start')[:50]
    
    context = {
        'recent_calls': recent_calls,
    }
    
    return render(request, 'admin/helpline.html', context)
