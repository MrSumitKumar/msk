# courses/serializers.py
from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model
from decimal import Decimal

User = get_user_model()


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


class SimpleCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'title', 'slug', 'price']


class CourseSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)
    categories = CategorySerializer(many=True, read_only=True)
    level = CourseLevelSerializer(read_only=True)
    language = CourseLanguageSerializer(many=True, read_only=True)
    single_courses = SimpleCourseSerializer(many=True, read_only=True)
    featured_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id', 'course_type', 'featured_image', 'featured_image_url', 'featured_video', 'title', 'description', 'categories', 'level', 'language', 'duration', 'price', 'discount', 'discount_end_date', 'certificate', 'mode', 'single_courses', 'enrollments', 'slug', 'status', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['slug', 'created_by', 'created_at', 'updated_at']

    def get_featured_image_url(self, obj):
        request = self.context.get('request')
        if obj.featured_image:
            if request:
                return request.build_absolute_uri(obj.featured_image.url)
            return obj.featured_image.url
        return None


class CourseCreateSerializer(serializers.ModelSerializer):
    single_courses = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.filter(course_type='SINGLE'),
        many=True, required=False
    )

    class Meta:
        model = Course
        exclude = ['created_by', 'slug']

    def validate(self, data):
        course_type = data.get('course_type')
        single_courses = data.get('single_courses', [])

        if course_type == 'COMBO' and not single_courses:
            raise serializers.ValidationError("Combo courses must include at least one single course.")
        return data

    def create(self, validated_data):
        user = self.context['request'].user
        single_courses = validated_data.pop('single_courses', [])
        course = Course.objects.create(created_by=user, **validated_data)
        if course.course_type == 'COMBO':
            course.single_courses.set(single_courses)
        return course


class AdminCourseSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)
    single_courses = SimpleCourseSerializer(many=True, read_only=True)
    single_course_ids = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.filter(course_type='SINGLE'),
        many=True,
        write_only=True,
        required=False,
    )
    discounted_price = serializers.SerializerMethodField()

    class Meta:
        model = Course
        exclude = ['slug']
        read_only_fields = ['created_by', 'created_at', 'updated_at']


    def create(self, validated_data):
        user = self.context['request'].user
        single_courses = validated_data.pop('single_course_ids', [])
        course = Course.objects.create(created_by=user, **validated_data)
        if course.course_type == 'COMBO':
            course.single_courses.set(single_courses)
        return course

    def update(self, instance, validated_data):
        single_courses = validated_data.pop('single_course_ids', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if single_courses is not None:
            instance.single_courses.set(single_courses)
        instance.save()
        return instance


class PublicCourseDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    total_reviews = serializers.IntegerField(read_only=True)

    class Meta:
        model = Course
        fields = [
            "id", "slug", "title", "description", "image",
            "price", "discount_price", "duration", "certificate", 
            "language", "level", "category", "teacher",
            "average_rating", "total_reviews",
            "created_at", "updated_at",
        ]


class CourseReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = CourseReview
        fields = ['id', 'user', 'rating', 'comment', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class ChapterTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChapterTopic
        fields = ['id', 'chapter', 'title', 'video_url', 'notes_url']
        


class CourseChapterSerializer(serializers.ModelSerializer):
    topics = ChapterTopicSerializer(many=True, read_only=True)

    class Meta:
        model = CourseChapter
        fields = ['id', 'course', 'title', 'topics']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['topics'] = sorted(representation['topics'], key=lambda x: x['id'])
        return representation


class CourseDetailWithChaptersSerializer(serializers.ModelSerializer):
    chapters = CourseChapterSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['chapters'] = sorted(representation['chapters'], key=lambda x: x['id'])
        return representation


class EnrollmentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    course = SimpleCourseSerializer(read_only=True)
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(),
        source='course',
        write_only=True
    )

    class Meta:
        model = Enrollment
        fields = [
            'id', 'user', 'course', 'course_id', 'enrollment_no',
            'amount', 'total_due_amount', 'total_paid_amount',
            'payment_complete', 'total_emi', 'emi', 'payment_method',
            'status', 'is_active', 'certificate',
            'enrolled_at', 'end_at'
        ]
        read_only_fields = ['enrollment_no', 'payment_complete', 'enrolled_at']


class EnrollmentFeeHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EnrollmentFeeHistory
        fields = ['id', 'enrollment', 'payment_method', 'payment_gateway', 'amount', 'paid_at']
