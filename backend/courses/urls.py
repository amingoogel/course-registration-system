from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet

router = DefaultRouter()
router.register(r'', CourseViewSet, basename='course') 
router.register(r'prerequisites', PrerequisiteViewSet, basename='prerequisite')

urlpatterns = [
    path('', include(router.urls)),  
]