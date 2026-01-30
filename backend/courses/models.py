from django.db import models
from users.models import User
from django.core.validators import MinValueValidator

class Term(models.Model):
    name = models.CharField("نام نیم‌سال", max_length=100, unique=True, help_text="مثل نیم‌سال اول ۱۴۰۴")
    start_selection = models.DateTimeField("شروع انتخاب واحد")
    end_selection = models.DateTimeField("پایان انتخاب واحد")
    is_active = models.BooleanField("فعال", default=False)

    def __str__(self):
        return self.name

class Course(models.Model):
    code = models.CharField("کد درس", max_length=20, unique=True)
    name = models.CharField("نام درس", max_length=200)
    professor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True,
                                  limit_choices_to={'role': 'professor'}, related_name='courses')
    capacity = models.PositiveIntegerField("ظرفیت", default=30)
    units = models.PositiveIntegerField(
        "تعداد واحد",
        default=3,
        validators=[MinValueValidator(1)],  # حداقل ۱
    )
    day = models.CharField("روز برگزاری", max_length=20, default="شنبه")
    start_time = models.TimeField("ساعت شروع", null=True, blank=True)
    end_time = models.TimeField("ساعت پایان", null=True, blank=True)
    location = models.CharField("محل برگزاری", max_length=100, blank=True)
    term = models.ForeignKey(Term, on_delete=models.CASCADE, related_name='courses', null=True, blank=True)

    def __str__(self):
        return f"{self.code} - {self.name}"

class Prerequisite(models.Model):

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='prerequisites')
    prerequisite = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='required_for')

    class Meta:
        unique_together = ('course', 'prerequisite')

    def __str__(self):
        return f"{self.prerequisite} پیش‌نیاز {self.course}"
    
class UnitLimit(models.Model):
    min_units = models.PositiveIntegerField(default=12)
    max_units = models.PositiveIntegerField(default=20)

    class Meta:
        verbose_name_plural = "حد واحدهای اخذ شده"

    def __str__(self):
        return f"حداقل {self.min_units} - حداکثر {self.max_units} واحد"
