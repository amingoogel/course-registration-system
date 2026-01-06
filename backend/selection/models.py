from django.db import models
from users.models import User
from courses.models import Course

class CourseSelection(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='selections', limit_choices_to={'role': 'student'})
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='selections')
    selected_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'course')

    def __str__(self):
        return f"{self.student} - {self.course}"