from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    ProviderStatusUpdateView, ServiceRequestView, SubscriptionViewSet,
    ReviewViewSet, VehicleExchangeViewSet, WalletViewSet,
    RewardsViewSet, HelplineCallViewSet, AgenticBookingView,
    SubscriptionAnalyticsView, DashboardStatsView, VehicleViewSet,
    ServiceQuoteViewSet, ProviderJobView, AIStatsView
)
from .admin_views import user_list, service_request_list, payment_list

router = DefaultRouter()
router.register(r'vehicles', VehicleViewSet, basename='vehicle')
router.register(r'subscriptions', SubscriptionViewSet, basename='subscription')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'vehicle-exchange', VehicleExchangeViewSet, basename='vehicle-exchange')
router.register(r'quotes', ServiceQuoteViewSet, basename='service-quote')
router.register(r'wallet', WalletViewSet, basename='wallet')
router.register(r'rewards', RewardsViewSet, basename='rewards')
router.register(r'helpline', HelplineCallViewSet, basename='helpline')
router.register(r'provider/jobs', ProviderJobView, basename='provider-jobs')

urlpatterns = [
    # Admin endpoints
    path('admin/dashboard-stats/', DashboardStatsView.as_view(), name='admin-dashboard-stats'),
    path('admin/ai-stats/', AIStatsView.as_view(), name='admin-ai-stats'),
    path('admin/users/', user_list, name='admin-user-list'),
    path('admin/bookings/', service_request_list, name='admin-booking-list'),
    path('admin/payments/', payment_list, name='admin-payment-list'),
    # Customer endpoints
    path('request/', ServiceRequestView.as_view(), name='service-request-create'),
    path('request/<int:request_id>/', ServiceRequestView.as_view(), name='service-request-status'),
    path('agentic-booking/', AgenticBookingView.as_view(), name='agentic-booking-create'),
    path('subscriptions/analytics/', SubscriptionAnalyticsView.as_view(), name='subscription-analytics'),
    # Provider endpoints
    path('provider/update/<int:request_id>/', ProviderStatusUpdateView.as_view(), name='provider-status-update'),
    # All API endpoints (handled by router)
    path('', include(router.urls)),
]
