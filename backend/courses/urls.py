from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, PrerequisiteViewSet, UnitLimitViewSet

router = DefaultRouter()
router.register(r'', CourseViewSet, basename='course') 
router.register(r'prerequisites', PrerequisiteViewSet, basename='prerequisite')
router.register(r'unit-limits', UnitLimitViewSet)

urlpatterns = [
    path('', include(router.urls)),  
]