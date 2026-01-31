from django.contrib.auth.signals import user_logged_in, user_login_failed
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import LoginHistory

User = get_user_model()

@receiver(user_logged_in)
def log_successful_login(sender, request, user, **kwargs):
    """ثبت ورود موفق"""
    ip = request.META.get('REMOTE_ADDR', None)
    ua = request.META.get('HTTP_USER_AGENT', None)

    LoginHistory.objects.create(
        user=user,
        ip_address=ip,
        user_agent=ua,
        is_success=True
    )

@receiver(user_login_failed)
def log_failed_login(sender, credentials, request, **kwargs):
    """ثبت تلاش ناموفق ورود"""
    ip = request.META.get('REMOTE_ADDR', None) if request else None
    ua = request.META.get('HTTP_USER_AGENT', None) if request else None

    LoginHistory.objects.create(
        user=None,  # چون کاربر معتبر نیست
        ip_address=ip,
        user_agent=ua,
        is_success=False,
        failure_reason=f"نام کاربری یا رمز عبور اشتباه - {credentials.get('username', 'نامشخص')}"
    )