from rest_framework import viewsets, status, permissions, filters
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from .models import Course, Prerequisite, UnitLimit, Term
from users.models import User
from .serializers import CourseSerializer, PrerequisiteSerializer, UnitLimitSerializer, ProfessorSerializer, TermSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated


class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user, 'role', None) == 'admin'

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().order_by('code')
    serializer_class = CourseSerializer
    lookup_field = 'code'
    lookup_url_kwarg = 'code'
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


class CoursesWithPrerequisitesAPIView(APIView):
    """لیست دروسی که پیش‌نیاز دارند - فقط کد درس و کد پیش‌نیازها"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # دروس یکتا که حداقل یک پیش‌نیاز دارند
        course_codes_with_prereqs = (
            Prerequisite.objects.values_list('course__code', flat=True)
            .distinct()
        )
        result = []
        for course_code in course_codes_with_prereqs:
            prereq_codes = list(
                Prerequisite.objects.filter(course__code=course_code)
                .values_list('prerequisite__code', flat=True)
            )
            result.append({
                "course_code": course_code,
                "prerequisite_codes": prereq_codes,
            })
        return Response(result)

class UnitLimitAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        return [IsAdminUser()]

    def get(self, request):
        limit = UnitLimit.objects.first()
        if not limit:
            limit = UnitLimit.objects.create()  # اگر وجود نداشت بساز
        serializer = UnitLimitSerializer(limit)
        return Response(serializer.data)

    def post(self, request):
        # اگر رکورد وجود داشت، بروزرسانی کن
        limit = UnitLimit.objects.first()
        if limit:
            serializer = UnitLimitSerializer(limit, data=request.data, partial=True)
        else:
            serializer = UnitLimitSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK if limit else status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfessorListView(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.filter(role='professor').order_by('last_name')
    serializer_class = ProfessorSerializer

    permission_classes = [IsAdminUser]


class TermViewSet(viewsets.ModelViewSet):
    """مدیریت نیم‌سال‌ها - ادمین: CRUD + فعال/غیرفعال | دانشجو/استاد: فقط مشاهده"""
    queryset = Term.objects.all().order_by('-start_selection')
    serializer_class = TermSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [IsAdminUser()]

    @action(detail=True, methods=['post'], url_path='toggle-active')
    def toggle_active(self, request, pk=None):
        """فعال/غیرفعال کردن انتخاب واحد برای این نیم‌سال"""
        term = self.get_object()
        term.is_active = not term.is_active
        term.save()
        status_text = "فعال" if term.is_active else "غیرفعال"
        return Response({
            "detail": f"نیم‌سال {term.name} با موفقیت {status_text} شد.",
            "is_active": term.is_active
        })