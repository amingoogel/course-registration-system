from rest_framework import serializers
from .models import Course

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