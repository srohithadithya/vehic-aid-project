from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .serializers import CustomTokenObtainPairSerializer
from .views import (
    BookerRegisterView,
    ProviderLocationUpdateView,
    ProviderRegisterView,
    UserProfileView,
    LanguagePreferenceView,
    DeviceTokenView
)

urlpatterns = [
    # General Auth
    path(
        "token/",
        TokenObtainPairView.as_view(serializer_class=CustomTokenObtainPairSerializer),
        name="token_obtain_pair",
    ),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # Registration
    path("register/booker/", BookerRegisterView.as_view(), name="register-booker"),
    path(
        "register/provider/", ProviderRegisterView.as_view(), name="register-provider"
    ),
    # Provider Operations
    path(
        "provider/update-location/",
        ProviderLocationUpdateView.as_view(),
        name="provider-update-location",
    ),
    # Profile management
    path("profile/", UserProfileView.as_view(), name="user-profile"),
    path("profile/language/", LanguagePreferenceView.as_view(), name="user-language-preference"),
    path("device/register/", DeviceTokenView.as_view(), name="register-device-token"),
]
