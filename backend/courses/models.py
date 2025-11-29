from django.db import models
from users.models import User

class Course(models.Model):
    code = models.CharField("کد درس", max_length=20, unique=True)
    name = models.CharField("نام درس", max_length=200)
    professor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True,
                                  limit_choices_to={'role': 'professor'}, related_name='courses')
    capacity = models.PositiveIntegerField("ظرفیت", default=30)
    units = models.PositiveIntegerField("تعداد واحد", default=3)
    day = models.CharField("روز برگزاری", max_length=20, default="شنبه")
    start_time = models.TimeField("ساعت شروع", null=True, blank=True)
    end_time = models.TimeField("ساعت پایان", null=True, blank=True)
    location = models.CharField("محل برگزاری", max_length=100, blank=True)

    def __str__(self):
        return f"{self.code} - {self.name}"