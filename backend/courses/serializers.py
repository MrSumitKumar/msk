# courses/serializers.py
from rest_framework import serializers
from .models import Course, Category, Level, Language, CourseChapter, ChapterTopic, CourseReview, Enrollment, EnrollmentFeeHistory
from django.contrib.auth import get_user_model
from decimal import Decimal

User = get_user_model()


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class CourseLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        fields = ['id', 'name']


class CourseLanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ['id', 'name']



class SimpleCourseSerializer(serializers.ModelSerializer):
    featured_image_url = serializers.SerializerMethodField()
    chapters_count = serializers.SerializerMethodField()
    enrolled_count = serializers.SerializerMethodField()
    language = CourseLanguageSerializer(many=True, read_only=True)

    def get_featured_image_url(self, obj):
        request = self.context.get('request')
        if obj.featured_image:
            if request:
                return request.build_absolute_uri(obj.featured_image.url)
            return obj.featured_image.url
        return None

    def get_chapters_count(self, obj):
        if obj.course_type == 'SINGLE':
            return obj.chapters.count()
        return None
        
    def get_enrolled_count(self, obj):
        return obj.enrollments.filter(status='Approved').count()

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'slug', 'price', 'discount', 'duration', 
            'featured_image_url', 'chapters_count', 'enrolled_count',
            'course_type', 'language'
        ]


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
            'id', 'course_type', 'featured_image', 'featured_image_url', 'featured_video', 'title', 'description', 'categories', 'level', 'language', 'duration', 'price', 'discount', 'discount_end_date', 'certificate', 'mode', 'single_courses', 'slug', 'status', 'created_by', 'created_at', 'updated_at']
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
    
    def get_discounted_price(self, obj):
        if obj.discount:
            return float(obj.price) * (1 - float(obj.discount) / 100)
        return float(obj.price)



class PublicCourseDetailSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    level = CourseLevelSerializer(read_only=True)
    language = CourseLanguageSerializer(many=True, read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    total_reviews = serializers.IntegerField(read_only=True)
    discount_price = serializers.SerializerMethodField()
    featured_image_url = serializers.SerializerMethodField()
    chapters_count = serializers.SerializerMethodField()
    single_courses = SimpleCourseSerializer(many=True, read_only=True)
    enrolled_count = serializers.SerializerMethodField()

    def get_featured_image_url(self, obj):
        request = self.context.get('request')
        if obj.featured_image:
            if request:
                return request.build_absolute_uri(obj.featured_image.url)
            return obj.featured_image.url
        return None

    def get_chapters_count(self, obj):
        if obj.course_type == 'SINGLE':
            return obj.chapters.count()
        return None
        
    def get_enrolled_count(self, obj):
        return obj.enrollments.filter(status='Approved').count()

    class Meta:
        model = Course
        fields = [
            "id", "slug", "title", "sort_description", "featured_image", "featured_image_url",
            "price", "discount", "discount_price", "duration", "certificate", 
            "language", "level", "categories", "created_by", "course_type",
            "average_rating", "total_reviews", "mode", "chapters_count",
            "single_courses", "enrolled_count", "created_at", "updated_at",
        ]

    def get_discount_price(self, obj):
        if obj.discount:
            return float(obj.price) * (1 - float(obj.discount) / 100)
        return float(obj.price)


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
    single_courses = SimpleCourseSerializer(many=True, read_only=True)
    featured_image_url = serializers.SerializerMethodField()
    enrolled_count = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'slug', 'sort_description', 'featured_image',
            'featured_image_url', 'featured_video', 'price', 'discount',
            'duration', 'certificate', 'course_type', 'mode', 'status',
            'chapters', 'single_courses', 'enrolled_count'
        ]

    def get_featured_image_url(self, obj):
        request = self.context.get('request')
        if obj.featured_image:
            if request:
                return request.build_absolute_uri(obj.featured_image.url)
            return obj.featured_image.url
        return None

    def get_enrolled_count(self, obj):
        return obj.enrollments.filter(status='Approved').count()

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
            'payment_complete', 'payment_method',
            'status', 'is_active', 'certificate',
            'enrolled_at', 'end_at'
        ]
        read_only_fields = ['enrollment_no', 'payment_complete', 'enrolled_at']


class EnrollmentFeeHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EnrollmentFeeHistory
        fields = ['id', 'enrollment', 'payment_method', 'payment_gateway', 'amount', 'paid_at']

