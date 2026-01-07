from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import CourseSelection
from .serializers import CourseSelectionSerializer
from .services import SelectionService
from courses.models import Course

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