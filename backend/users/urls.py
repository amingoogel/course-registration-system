from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserRegistrationViewSet,
    LoginHistoryViewSet,
    CurrentUserAPIView,
    StudentListView,
    ProfessorListForAdminView,
)

router = DefaultRouter()
router.register(r'register', UserRegistrationViewSet, basename='user-register')
router.register(r'login-history', LoginHistoryViewSet, basename='login-history')
router.register(r'students', StudentListView, basename='student-list')
router.register(r'professors', ProfessorListForAdminView, basename='professor-list-admin')

urlpatterns = [
    path('', include(router.urls)),
    path('me/', CurrentUserAPIView.as_view(), name='current-user'),
]