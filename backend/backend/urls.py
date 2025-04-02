from django.views.decorators.csrf import csrf_exempt
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import BidViewSet, UserViewSet, AuctionPostViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.contrib.auth import views as auth_views
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'bids', BidViewSet)
router.register(r'auctions', AuctionPostViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include(router.urls)),
    path("password_reset/", csrf_exempt(auth_views.PasswordResetView.as_view()), name="password_reset"),
    path("password_reset/done/", auth_views.PasswordResetDoneView.as_view(), name="password_reset_done"),
    path('password_reset/confirm/<uidb64>/<token>/', csrf_exempt(auth_views.PasswordResetConfirmView.as_view()),
         name='password_reset_confirm'),
    path("password_reset/complete/", auth_views.PasswordResetCompleteView.as_view(),
         name="password_reset_complete"),
    path("api/v1/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/v1/token/refresh/", TokenRefreshView.as_view(), name="token_refresh")
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
