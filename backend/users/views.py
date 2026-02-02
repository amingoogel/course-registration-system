from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from .models import User, LoginHistory
from .serializers import (
    RegisterStudentSerializer,
    RegisterProfessorSerializer,
    UserSerializer,
    LoginHistorySerializer,
    StudentListSerializer,
    ProfessorListSerializer,
)
from rest_framework.views import APIView

class IsAdminUser(IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.role == 'admin'

class UserRegistrationViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminUser]

    @action(detail=False, methods=['post'], url_path='register-student')
    def register_student(self, request):
        serializer = RegisterStudentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='register-professor')
    def register_professor(self, request):
        serializer = RegisterProfessorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CurrentUserAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class LoginHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = LoginHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return LoginHistory.objects.all().order_by('-login_at')
        return LoginHistory.objects.filter(user=user).order_by('-login_at')


class StudentListView(viewsets.ReadOnlyModelViewSet):
    """لیست دانشجویان برای ادمین: شماره دانشجویی، اسم، فامیل"""
    queryset = User.objects.filter(role='student').order_by('last_name', 'first_name')
    serializer_class = StudentListSerializer
    permission_classes = [IsAdminUser]


class ProfessorListForAdminView(viewsets.ReadOnlyModelViewSet):
    """لیست اساتید برای ادمین: شماره پرسنلی، اسم، فامیل"""
    queryset = User.objects.filter(role='professor').order_by('last_name', 'first_name')
    serializer_class = ProfessorListSerializer
    permission_classes = [IsAdminUser]