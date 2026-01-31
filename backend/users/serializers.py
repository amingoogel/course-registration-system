from rest_framework import serializers
from .models import User, LoginHistory

class RegisterStudentSerializer(serializers.ModelSerializer):
    student_number = serializers.CharField(write_only=True, help_text="شماره دانشجویی - میشه یوزرنیم")
    national_code = serializers.CharField(write_only=True, help_text="کد ملی - میشه پسورد")

    class Meta:
        model = User
        fields = ['student_number', 'national_code', 'first_name', 'last_name']

    def create(self, validated_data):
        student_number = validated_data.pop('student_number')
        national_code = validated_data.pop('national_code')

        user = User.objects.create_user(
            username=student_number,
            password=national_code,
            role='student',
            **validated_data
        )
        return user

    def to_representation(self, instance):
        return {
            "message": "دانشجو با موفقیت ثبت شد",
            "username": instance.username,  # شماره دانشجویی
            "password": "کد ملی وارد شده",  # پسورد رو مستقیم نشون نمیدیم، ولی میگیم کد ملیشونه
            "full_name": instance.get_full_name()
        }

class RegisterProfessorSerializer(serializers.ModelSerializer):
    personnel_number = serializers.CharField(write_only=True, help_text="شماره پرسنلی - میشه یوزرنیم")
    national_code = serializers.CharField(write_only=True, help_text="کد ملی - میشه پسورد")

    class Meta:
        model = User
        fields = ['personnel_number', 'national_code', 'first_name', 'last_name']

    def create(self, validated_data):
        personnel_number = validated_data.pop('personnel_number')
        national_code = validated_data.pop('national_code')

        user = User.objects.create_user(
            username=personnel_number,
            password=national_code,
            role='professor',
            **validated_data
        )
        return user

    def to_representation(self, instance):
        return {
            "message": "استاد با موفقیت ثبت شد",
            "username": instance.username,  # شماره پرسنلی
            "password": "کد ملی وارد شده",
            "full_name": instance.get_full_name()
        }

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'role']


class LoginHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = LoginHistory
        fields = [
            'id',
            'login_at',
            'ip_address',
            'user_agent',
            'is_success',
            'failure_reason'
        ]
        read_only_fields = fields 