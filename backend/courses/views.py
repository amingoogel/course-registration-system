from rest_framework import viewsets, status, permissions, filters
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from .models import Course, Prerequisite, UnitLimit
from users.models import User
from .serializers import CourseSerializer, PrerequisiteSerializer,UnitLimitSerializer, ProfessorSerializer

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user, 'role', None) == 'admin'

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().order_by('code')
    serializer_class = CourseSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name', 'professor__first_name', 'professor__last_name', 'code']
    filterset_fields = ['professor', 'day']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [IsAdminUser()]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({"detail": "درس با موفقیت حذف شد"})

class PrerequisiteViewSet(viewsets.ModelViewSet):
    queryset = Prerequisite.objects.all()
    serializer_class = PrerequisiteSerializer
    permission_classes = [IsAdminUser]

class UnitLimitViewSet(viewsets.ModelViewSet):
    queryset = UnitLimit.objects.all()
    serializer_class = UnitLimitSerializer
    permission_classes = [IsAdminUser]

    def get_object(self):
        # همیشه فقط رکورد id=1 رو برگردون (اگه نباشه بساز)
        obj, created = UnitLimit.objects.get_or_create(id=1)
        return obj

class ProfessorListView(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.filter(role='professor').order_by('last_name')
    serializer_class = ProfessorSerializer

    permission_classes = [IsAdminUser]