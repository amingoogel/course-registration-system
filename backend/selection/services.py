from django.core.exceptions import ValidationError
from django.db import transaction
from .repositories import SelectionRepository
from courses.models import UnitLimit

class SelectionService:
    def __init__(self):
        self.repo = SelectionRepository()

    @transaction.atomic
    def select_course(self, student, course):
        if not course.term.is_active:
            errors.append("مهلت انتخاب واحد برای این نیم‌سال تمام شده است.")


    @transaction.atomic
    def select_course(self, student, course):
        errors = []

        # قانون ۱: بررسی تکرار
        if self.repo.selection_exists(student, course):
            errors.append("این درس قبلاً اخذ شده است.")

        # قانون ۲: بررسی ظرفیت
        if course.enrolled_count >= course.capacity:
            errors.append("ظرفیت درس پر شده است.")

        # قانون ۳: بررسی پیش‌نیاز
        prereqs = self.repo.get_prerequisites_for_course(course)
        for prereq in prereqs:
            if not self.repo.has_passed_prereq(student, prereq.prerequisite):
                errors.append(f"پیش‌نیاز {prereq.prerequisite.name} پاس نشده است.")

        # قانون ۴: بررسی تداخل زمانی
        if self.repo.has_time_conflict(student, course):
            errors.append("تداخل زمانی با درس دیگر.")

        # قانون ۵: بررسی حد واحد
        current_units = self.repo.get_student_current_units(student)
        limit = UnitLimit.objects.first() or UnitLimit(min_units=12, max_units=20)
        new_total = current_units + course.units

        if new_total > limit.max_units:
            errors.append(f"حداکثر واحد مجاز ({limit.max_units}) رعایت نشده است.")

        # حداقل رو اینجا چک نمی‌کنیم → اجازه می‌دیم کمتر انتخاب کنه

        # قانون ۶: بررسی حذف مجاز (برای حذف)
        # قانون ۷: بررسی حذف دانشجو از درس مجاز (برای استاد)

        if errors:
            raise ValidationError(errors)

        # ثبت
        selection = CourseSelection.objects.create(student=student, course=course)
        course.enrolled_count += 1
        course.save()
        return selection

    def has_passed_prereq(self, student, prereq):
        previous_selection = CourseSelection.objects.filter(student=student, course=prereq, is_finalized=True).first()
        if previous_selection:
            grade = Grade.objects.filter(selection=previous_selection).first()
            if grade and grade.score >= 10:
                return True
        return False

    @transaction.atomic
    def delete_selection(self, student, course):
        selection = CourseSelection.objects.filter(student=student, course=course).first()
        if not selection:
            raise ValidationError("این درس اخذ نشده است.")
        selection.delete()
        course.enrolled_count -= 1
        course.save()

    @transaction.atomic
    def professor_delete_student(self, professor, course, student):
        if course.professor != professor:
            raise ValidationError("شما استاد این درس نیستید.")
        selection = CourseSelection.objects.filter(student=student, course=course).first()
        if not selection:
            raise ValidationError("این دانشجو در این درس ثبت‌نام نکرده.")
        selection.delete()
        course.enrolled_count -= 1
        course.save()

