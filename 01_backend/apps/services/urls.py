from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    ProviderStatusUpdateView, ServiceRequestView, SubscriptionViewSet,
    ReviewViewSet, VehicleExchangeViewSet, WalletViewSet,
    RewardsViewSet, HelplineCallViewSet
)
from .admin_views import dashboard_stats, recent_activity, user_list, service_request_list, payment_list

router = DefaultRouter()
router.register(r'subscriptions', SubscriptionViewSet, basename='subscription')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'vehicle-exchange', VehicleExchangeViewSet, basename='vehicle-exchange')
router.register(r'wallet', WalletViewSet, basename='wallet')
router.register(r'rewards', RewardsViewSet, basename='rewards')
router.register(r'helpline', HelplineCallViewSet, basename='helpline')

urlpatterns = [
    # Admin endpoints
    path('admin/dashboard-stats/', dashboard_stats, name='admin-dashboard-stats'),
    path('admin/recent-activity/', recent_activity, name='admin-recent-activity'),
    path('admin/users/', user_list, name='admin-user-list'),
    path('admin/bookings/', service_request_list, name='admin-booking-list'),
    path('admin/payments/', payment_list, name='admin-payment-list'),
    # Customer endpoints
    path('request/', ServiceRequestView.as_view(), name='service-request-create'),
    path('request/<int:request_id>/', ServiceRequestView.as_view(), name='service-request-status'),
    # Provider endpoints
    path('provider/update/<int:request_id>/', ProviderStatusUpdateView.as_view(), name='provider-status-update'),
    # All API endpoints (handled by router)
    path('', include(router.urls)),
]
