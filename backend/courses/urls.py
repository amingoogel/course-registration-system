from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, PrerequisiteViewSet, UnitLimitViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'prerequisites', PrerequisiteViewSet, basename='prerequisite')
router.register(r'unit-limit', UnitLimitViewSet, basename='unitlimit')

urlpatterns = router.urls