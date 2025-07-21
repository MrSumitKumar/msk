from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Course, Category, Label, CourseLanguage

class CourseSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Course
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class CourseLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = ['id', 'name']

class CourseLanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseLanguage
        fields = ['id', 'name']
