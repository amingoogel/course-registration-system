from rest_framework import serializers
from .models import Course, Prerequisite

class CourseSerializer(serializers.ModelSerializer):
    professor_name = serializers.CharField(source='professor.get_full_name', read_only=True)

    class Meta:
        model = Course
        fields = '__all__'

    def validate_code(self, value):
        if self.instance:
            if Course.objects.filter(code=value).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError("کد درس تکراری است")
        else:
            if Course.objects.filter(code=value).exists():
                raise serializers.ValidationError("کد درس تکراری است")
        return value

class PrerequisiteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Prerequisite
        fields = '__all__'  

    def validate(self, data):
        if data['course'] == data['prerequisite']:
            raise serializers.ValidationError("درس نمی‌تواند پیش‌نیاز خودش باشد")
        return data

        
class UnitLimitSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnitLimit
        fields = '__all__'