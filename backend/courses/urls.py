from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, PrerequisiteViewSet, UnitLimitAPIView, ProfessorListView

router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'prerequisites', PrerequisiteViewSet, basename='prerequisite')
router.register(r'professors', ProfessorListView, basename='professor-list')


urlpatterns = router.urls

urlpatterns += [
    path('unit-limit/', UnitLimitAPIView.as_view(), name='unit-limit'),
]