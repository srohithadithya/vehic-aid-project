import logging
import re
from functools import wraps
from django.conf import settings
from django.core.exceptions import PermissionDenied
from django.http import HttpResponseRedirect
from rest_framework import permissions, exceptions
from rest_framework.views import exception_handler
from django.utils.translation import gettext_lazy as _

logger = logging.getLogger(__name__)

# --- 1. Custom Admin Permission (Role-based) ---
class IsAdminRole(permissions.BasePermission):
    """
    Check if user.role === 'admin' on the server.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return getattr(request.user, 'role', None) == 'admin'

def admin_role_required(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated or getattr(request.user, 'role', None) != 'admin':
            logger.warning(f"Unauthorized admin access attempt by {request.user}")
            raise PermissionDenied("Admin role required.")
        return view_func(request, *args, **kwargs)
    return _wrapped_view

# --- 2. Redirect Allowlist Validation ---
SAFE_REDIRECT_ALLOWLIST = getattr(settings, 'CORS_ALLOWED_ORIGINS', []) + [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3003',
]

def validate_redirect_url(url):
    """
    Ensures all redirect URLs are validated against an allowlist.
    """
    if not url:
        return "/"
    
    # Allow relative URLs
    if url.startswith('/') and not url.startswith('//'):
        return url
        
    # Check against allowlist
    for allowed in SAFE_REDIRECT_ALLOWLIST:
        if url.startswith(allowed):
            return url
            
    logger.error(f"Malicious redirect blocked: {url}")
    return "/"

# --- 3. Generic Error Handler ---
def generic_exception_handler(exc, context):
    """
    Catch all errors and return generic messages to users.
    Log detailed errors server-side only.
    """
    # Call DRF's default exception handler first to get the standard error response.
    response = exception_handler(exc, context)

    # Log the detailed error
    logger.error(f"EXCEPTION: {exc} | Context: {context}", exc_info=True)

    if response is not None:
        # If it's a known DRF exception, we can keep the structure but simplify message if it's potentially sensitive
        if isinstance(exc, (exceptions.APIException)):
            # Customize if needed, for now we keep it mostly but clean up
            pass
    else:
        # This is an unhandled exception (500)
        from rest_framework.response import Response
        response = Response(
            {"detail": _("A server error occurred. Please try again later.")},
            status=500
        )

    return response
