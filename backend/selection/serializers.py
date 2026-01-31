from rest_framework import serializers
from .models import CourseSelection

class CourseSelectionSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='course.name', read_only=True)

    class Meta:
        model = CourseSelection
        fields = '__all__'