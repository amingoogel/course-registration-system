from rest_framework import serializers
from .models import Course, Prerequisite, UnitLimit, Term
from users.models import User


class TermSerializer(serializers.ModelSerializer):
    class Meta:
        model = Term
        fields = ['id', 'name', 'start_selection', 'end_selection', 'is_active']


class CourseSerializer(serializers.ModelSerializer):
    professor_name = serializers.CharField(source='professor.get_full_name', read_only=True)
    professor_personnel_number = serializers.SlugRelatedField(
        slug_field='username',
        queryset=User.objects.filter(role='professor'),
        required=False,
        allow_null=True,
        write_only=True,
        source='professor',
        help_text='شماره پرسنلی استاد'
    )
    professor_number = serializers.SerializerMethodField()

    def get_professor_number(self, obj):
        return obj.professor.username if obj.professor else None

    class Meta:
        model = Course
        fields = '__all__'
        extra_kwargs = {'professor': {'read_only': True}}

    def validate_code(self, value):
        if self.instance:
            if Course.objects.filter(code=value).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError("کد درس تکراری است")
        else:
            if Course.objects.filter(code=value).exists():
                raise serializers.ValidationError("کد درس تکراری است")
        return value

class PrerequisiteSerializer(serializers.ModelSerializer):
    course_code = serializers.SlugRelatedField(
        slug_field='code', queryset=Course.objects.all(),
        write_only=True, source='course'
    )
    prerequisite_code = serializers.SlugRelatedField(
        slug_field='code', queryset=Course.objects.all(),
        write_only=True, source='prerequisite'
    )
    course = serializers.SlugRelatedField(slug_field='code', read_only=True)
    prerequisite = serializers.SlugRelatedField(slug_field='code', read_only=True)

    class Meta:
        model = Prerequisite
        fields = ['id', 'course', 'prerequisite', 'course_code', 'prerequisite_code']

    def validate(self, data):
        if data['course'] == data['prerequisite']:
            raise serializers.ValidationError("درس نمی‌تواند پیش‌نیاز خودش باشد")
        return data


class UnitLimitSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnitLimit
        fields = ['min_units', 'max_units']

class ProfessorSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'full_name']

    def get_full_name(self, obj):
        return obj.get_full_name()