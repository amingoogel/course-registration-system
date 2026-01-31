"""Custom JWT views for logging login history (JWT doesn't trigger Django's user_logged_in signal)."""
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import LoginHistory


class LoginHistoryTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # ثبت ورود موفق در LoginHistory (JWT سیگنال user_logged_in را فراخوانی نمی‌کند)
        request = self.context.get('request')
        ip = request.META.get('REMOTE_ADDR') if request else None
        ua = request.META.get('HTTP_USER_AGENT') if request else None
        LoginHistory.objects.create(
            user=self.user,
            ip_address=ip,
            user_agent=ua,
            is_success=True,
        )
        return data


class LoginHistoryTokenObtainPairView(TokenObtainPairView):
    serializer_class = LoginHistoryTokenObtainPairSerializer
