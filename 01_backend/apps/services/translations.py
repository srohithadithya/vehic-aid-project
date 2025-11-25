"""
Translation utilities for Vehic-Aid multilingual support.
"""

from django.utils.translation import gettext_lazy as _

# Common translations used across the application
COMMON_TRANSLATIONS = {
    # App name
    'app_name': _('Vehic-Aid'),
    'tagline': _('24/7 Roadside Assistance'),
    
    # Navigation
    'dashboard': _('Dashboard'),
    'subscriptions': _('Subscriptions'),
    'services': _('Services'),
    'wallet': _('Wallet'),
    'rewards': _('Rewards'),
    'profile': _('Profile'),
    'settings': _('Settings'),
    'logout': _('Logout'),
    
    # Service types
    'towing': _('Towing'),
    'jumpstart': _('Jumpstart'),
    'tire_change': _('Tire Change'),
    'fuel_delivery': _('Fuel Delivery'),
    'lockout': _('Lockout Service'),
    'general': _('General Service'),
    
    # Subscription plans
    'free_plan': _('Free Plan'),
    'standard_plan': _('Standard Plan'),
    'premium_plan': _('Premium Plan'),
    
    # Common actions
    'submit': _('Submit'),
    'cancel': _('Cancel'),
    'save': _('Save'),
    'delete': _('Delete'),
    'edit': _('Edit'),
    'view': _('View'),
    'search': _('Search'),
    'filter': _('Filter'),
    
    # Status
    'active': _('Active'),
    'inactive': _('Inactive'),
    'pending': _('Pending'),
    'completed': _('Completed'),
    'cancelled': _('Cancelled'),
    
    # Messages
    'success': _('Success'),
    'error': _('Error'),
    'warning': _('Warning'),
    'info': _('Information'),
}

# Service request status translations
SERVICE_STATUS = {
    'PENDING_DISPATCH': _('Pending Dispatch'),
    'DISPATCHED': _('Provider En Route'),
    'ARRIVED': _('Provider Arrived'),
    'SERVICE_IN_PROGRESS': _('Service in Progress'),
    'QUOTE_PENDING': _('Quote Pending'),
    'COMPLETED': _('Completed'),
    'CANCELLED': _('Cancelled'),
}

# Subscription status translations
SUBSCRIPTION_STATUS = {
    'ACTIVE': _('Active'),
    'EXPIRED': _('Expired'),
    'CANCELLED': _('Cancelled'),
    'PENDING': _('Pending Payment'),
}
