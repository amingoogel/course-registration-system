from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth import get_user_model


class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'مدیر'),
        ('professor', 'استاد'),
        ('student', 'دانشجو'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')

    def save(self, *args, **kwargs):
        if self.is_superuser:
            self.role = 'admin'
        super().save(*args, **kwargs)
        

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set', 
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions_set', 
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


User = get_user_model()

class LoginHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='login_history')
    login_at = models.DateTimeField("زمان ورود", auto_now_add=True)
    ip_address = models.GenericIPAddressField("آدرس IP", null=True, blank=True)
    user_agent = models.TextField("مرورگر/دستگاه", blank=True, null=True)
    is_success = models.BooleanField("ورود موفق", default=True)
    failure_reason = models.CharField("دلیل ناموفق بودن (در صورت شکست)", max_length=255, blank=True, null=True)

    class Meta:
        verbose_name = "تاریخچه ورود"
        verbose_name_plural = "تاریخچه ورود کاربران"
        ordering = ['-login_at']

    def __str__(self):
        status = "موفق" if self.is_success else f"ناموفق - {self.failure_reason or 'نامشخص'}"
        return f"{self.user} – {self.login_at} ({status})"
