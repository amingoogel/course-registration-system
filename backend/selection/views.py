from django.core.exceptions import ValidationError
from django.db.models import Sum
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import CourseSelection, Grade
from .serializers import CourseSelectionSerializer
from .services import SelectionService
from courses.models import Course, Term
from courses.models import UnitLimit
from users.models import User

class SelectionViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSelectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'student':
            return CourseSelection.objects.filter(student=self.request.user)
        elif self.request.user.role == 'professor':
            return CourseSelection.objects.filter(course__professor=self.request.user)
        return CourseSelection.objects.none()

    @action(detail=False, methods=['post'], url_path='select-course')
    def select_course(self, request):
        if request.user.role != 'student':
            return Response({"error": "فقط دانشجویان می‌توانند درس انتخاب کنند."}, status=status.HTTP_403_FORBIDDEN)
        course_id = request.data.get('course_id')
        course = get_object_or_404(Course, id=course_id)
        try:
            selection = SelectionService().select_course(request.user, course)
            serializer = self.serializer_class(selection)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({"errors": e.messages}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['delete'], url_path='delete-selection')
    def delete_selection(self, request, pk=None):
        if request.user.role != 'student':
            return Response({"error": "فقط دانشجویان می‌توانند درس حذف کنند."}, status=status.HTTP_403_FORBIDDEN)
        course = get_object_or_404(Course, id=pk)
        try:
            SelectionService().delete_selection(request.user, course)
            return Response({"success": "درس با موفقیت حذف شد."})
        except ValidationError as e:
            return Response({"errors": e.messages}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='schedule')
    def get_schedule(self, request):
        if request.user.role != 'student':
            return Response({"error": "فقط دانشجویان می‌توانند برنامه ببینند."}, status=status.HTTP_403_FORBIDDEN)
        selections = self.get_queryset()
        schedule = {}
        for sel in selections:
            day = sel.course.day
            if day not in schedule:
                schedule[day] = []
            schedule[day].append({
                'course': sel.course.name,
                'time': f"{sel.course.start_time} - {sel.course.end_time}",
                'location': sel.course.location
            })
        return Response(schedule)

    @action(detail=False, methods=['post'], url_path='finalize')
    def finalize(self, request):
        if request.user.role != 'student':
            return Response({"detail": "فقط دانشجویان می‌توانند انتخاب واحد را نهایی کنند"}, status=403)

    # گرفتن تمام انتخاب‌های این دانشجو که هنوز نهایی نشده‌اند
        selections = CourseSelection.objects.filter(student=request.user, is_finalized=False)

        if not selections.exists():
            return Response({"detail": "هیچ درسی انتخاب نشده است"}, status=400)

        total_units = selections.aggregate(total=Sum('course__units'))['total'] or 0

        limit = UnitLimit.objects.first() or UnitLimit(min_units=12, max_units=20)

        if total_units < limit.min_units:
            return Response({
                "detail": f"تعداد واحد انتخاب‌شده ({total_units}) کمتر از حداقل مجاز ({limit.min_units}) است"
            }, status=400)

        if total_units > limit.max_units:
            return Response({
                "detail": f"تعداد واحد انتخاب‌شده ({total_units}) بیشتر از حداکثر مجاز ({limit.max_units}) است"
            }, status=400)

    # نهایی کردن
        selections.update(is_finalized=True)

        return Response({
            "detail": "انتخاب واحد با موفقیت نهایی شد",
            "total_units": total_units
        })

    @action(detail=False, methods=['get'], url_path='report-card')
    def get_report_card(self, request):
        term_id = request.query_params.get('term_id')
        if not term_id:
            return Response({"error": "نیم‌سال را مشخص کنید"}, status=400)

        term = get_object_or_404(Term, id=term_id)
        selections = CourseSelection.objects.filter(student=request.user, course__term=term, is_finalized=True)
        data = []
        total_units = 0
        total_score = 0

        for sel in selections:
            grade = Grade.objects.filter(selection=sel).first()
            score = grade.score if grade else "نامشخص"
            status = grade.status if grade else "نامشخص"
            data.append({
                "course": sel.course.name,
                "units": sel.course.units,
                "score": score,
                "status": status
            })
            if score != "نامشخص":
                total_units += sel.course.units
                total_score += score * sel.course.units

        gpa = total_score / total_units if total_units > 0 else 0

        return Response({
            "term": term.name,
            "courses": data,
            "gpa": round(gpa, 2)
        })

class ProfessorViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['get'], url_path='students')
    def get_students(self, request, pk=None):
        if request.user.role != 'professor':
            return Response({"error": "فقط اساتید می‌توانند لیست دانشجویان ببینند."}, status=status.HTTP_403_FORBIDDEN)
        course = get_object_or_404(Course, id=pk, professor=request.user)
        students = CourseSelection.objects.filter(course=course).order_by('student__last_name')
        serializer = CourseSelectionSerializer(students, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['delete'], url_path='remove-student')
    def remove_student(self, request, pk=None):
        if request.user.role != 'professor':
            return Response({"error": "فقط اساتید می‌توانند دانشجو حذف کنند."}, status=status.HTTP_403_FORBIDDEN)
        course = get_object_or_404(Course, id=pk, professor=request.user)
        student_id = request.data.get('student_id')
        student = get_object_or_404(User, id=student_id, role='student')
        try:
            SelectionService().professor_delete_student(request.user, course, student)
            return Response({"success": "دانشجو با موفقیت حذف شد."})
        except ValidationError as e:
            return Response({"errors": e.messages}, status=status.HTTP_400_BAD_REQUEST)