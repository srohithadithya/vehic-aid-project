from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from django.views.generic import TemplateView
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from rest_framework.permissions import AllowAny

urlpatterns = [
    # Django Admin Panel (Access to the Management UI)
    path("admin/", admin.site.urls),
    # API Endpoints (Version 1 - /api/v1/)
    path("api/v1/users/", include("apps.users.urls")),
    path("api/v1/services/", include("apps.services.urls")),
    path("api/v1/payments/", include("apps.payments.urls")),
    path("api/v1/iot/", include("apps.iot_devices.urls")),
    # Web Admin Dashboard
    # Web Admin Dashboard (Now handled by Next.js apps)

    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(permission_classes=[AllowAny]), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema', permission_classes=[AllowAny]), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema', permission_classes=[AllowAny]), name='redoc'),
    # Root Home Page
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
]

# Serving Static and Media Files in Development
from vehic_aid_backend.views import ProtectedMediaView
from django.urls import re_path

urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', ProtectedMediaView.as_view(), name='protected_media'),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [path("__debug__/", include(debug_toolbar.urls))]
    # static() is for non-protected static files (CSS/JS)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
