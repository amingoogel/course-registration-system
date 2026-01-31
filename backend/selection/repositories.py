from .models import CourseSelection
from courses.models import Prerequisite, Course
from django.db.models import Sum

class SelectionRepository:
    def get_student_selections(self, student):
        return CourseSelection.objects.filter(student=student)

    def selection_exists(self, student, course):
        return CourseSelection.objects.filter(student=student, course=course).exists()

    def get_prerequisites_for_course(self, course):
        return Prerequisite.objects.filter(course=course)

    def has_passed_prereq(self, student, prereq):
        return CourseSelection.objects.filter(student=student, course=prereq, passed=True).exists()  # فرض گذشت از درس

    def get_student_current_units(self, student):
        selections = self.get_student_selections(student)
        return selections.aggregate(total_units=Sum('course__units'))['total_units'] or 0

    def has_time_conflict(self, student, new_course):
        selections = self.get_student_selections(student)
        for sel in selections:
            if sel.course.day == new_course.day and (
                sel.course.start_time < new_course.end_time and sel.course.end_time > new_course.start_time
            ):
                return True
        return False