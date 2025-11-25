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
    # This is a placeholder - actual revenue would come from payments app
    total_revenue = 240000  # ₹2.4L placeholder
    
    # Average rating
    avg_rating = Review.objects.aggregate(Avg('rating'))['rating__avg'] or 4.8
    
    # Recent requests
    recent_requests = ServiceRequest.objects.select_related(
        'booker', 'provider'
    ).order_by('-created_at')[:10]
    
    # Service type distribution
    service_distribution = ServiceRequest.objects.values(
        'service_type'
    ).annotate(count=Count('id')).order_by('-count')
    
    context = {
        'total_requests': total_requests,
        'active_subscriptions': active_subscriptions,
        'total_revenue': total_revenue,
        'avg_rating': round(avg_rating, 1),
        'recent_requests': recent_requests,
        'service_distribution': service_distribution,
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
