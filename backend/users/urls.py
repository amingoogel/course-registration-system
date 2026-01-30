from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserRegistrationViewSet

router = DefaultRouter()
router.register(r'register', UserRegistrationViewSet, basename='user-register')
router.register(r'login-history', LoginHistoryViewSet, basename='login-history')

urlpatterns = [
    path('', include(router.urls)),
    path('me/', CurrentUserAPIView.as_view(), name='current-user'),
]