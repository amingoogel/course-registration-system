from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SelectionViewSet, ProfessorViewSet

router = DefaultRouter()
router.register(r'selections', SelectionViewSet, basename='selection')
router.register(r'professor', ProfessorViewSet, basename='professor')

urlpatterns = router.urls