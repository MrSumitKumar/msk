# courses/views.py
from rest_framework import (
    generics, permissions, filters, status, serializers
)
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework.views import APIView
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend

from .models import *
from .serializers import *
from .filters import CourseFilter

import pandas as pd
from io import BytesIO
from decimal import Decimal
from rest_framework.permissions import AllowAny
from django.db.models import Prefetch


# --------------------------
# Permissions
# --------------------------

class IsTeacherOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'teacher']

    def has_object_permission(self, request, view, obj):
        return request.user.role == 'admin' or obj.created_by == request.user


class AllowAnyReadOnlyOrTeacherAdmin(permissions.BasePermission):
    """
    - बिना login वाला user भी READ कर सकता है (GET/HEAD/OPTIONS)।
    - WRITE (POST, PUT, PATCH, DELETE) केवल Teacher/Admin कर सकते हैं।
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True   # anyone can read
        return request.user.is_authenticated and request.user.role in ['admin', 'teacher']

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.role == 'admin' or obj.created_by == request.user
    

# --------------------------
# Filters & Pagination
# --------------------------

class CourseFilterMixin:
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['title', 'description', 'created_by__username', 'language__name', 'categories__name', 'level__name']
    filterset_fields = ['categories', 'level', 'language', 'mode', 'course_type', 'certificate']
    filterset_class = CourseFilter
    ordering_fields = ['price', 'created_at']


class CoursePagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100


# --------------------------
# Public Course List / Detail
# --------------------------

class CourseListAPIView(CourseFilterMixin, generics.ListAPIView):
    serializer_class = CourseSerializer
    pagination_class = CoursePagination
    queryset = Course.objects.filter(status='PUBLISH').order_by('id')


class PublicCourseDetailAPIView(generics.RetrieveAPIView):
    serializer_class = PublicCourseDetailSerializer
    lookup_field = "slug"
    queryset = Course.objects.all()

    def get_object(self):
        course = super().get_object()
        # annotate reviews
        course.average_rating = CourseReview.objects.filter(course=course).aggregate(Avg('rating'))['rating__avg'] or 0
        course.total_reviews = CourseReview.objects.filter(course=course).count()
        return course


class PublicCourseWithChaptersAPIView(generics.RetrieveAPIView):
    serializer_class = CourseDetailWithChaptersSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        return Course.objects.filter(status='PUBLISH').prefetch_related(
            Prefetch(
                'chapters',
                queryset=CourseChapter.objects.prefetch_related(
                    Prefetch('topics', queryset=ChapterTopic.objects.order_by('id'))
                ).order_by('id')
            )
        )


# --------------------------
# Course Admin CRUD
# --------------------------

class CourseCreateAPIView(generics.CreateAPIView):
    serializer_class = CourseCreateSerializer
    permission_classes = [IsTeacherOrAdmin]


class CourseUpdateAPIView(generics.UpdateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseCreateSerializer
    permission_classes = [IsTeacherOrAdmin]
    lookup_field = 'slug'


class CourseDeleteAPIView(generics.DestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsTeacherOrAdmin]
    lookup_field = 'slug'


# --------------------------
# Category / Level / Language
# --------------------------

class CategoryListAPIView(generics.ListAPIView):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer


class CourseLevelListAPIView(generics.ListAPIView):
    queryset = Label.objects.all().order_by('name')
    serializer_class = CourseLevelSerializer


class CourseLanguageListAPIView(generics.ListAPIView):
    queryset = CourseLanguage.objects.all().order_by('name')
    serializer_class = CourseLanguageSerializer


# --------------------------
# Course Review APIs
# --------------------------

class CourseReviewListCreateView(generics.ListCreateAPIView):
    """
    GET  -> List reviews for a course
    POST -> Create a new review (one per user per course)
    """
    serializer_class = CourseReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        course = get_object_or_404(Course, slug=self.kwargs['slug'])
        return CourseReview.objects.filter(course=course).select_related('user').order_by('-created_at')

    def perform_create(self, serializer):
        course = get_object_or_404(Course, slug=self.kwargs['slug'])
        if CourseReview.objects.filter(course=course, user=self.request.user).exists():
            raise ValidationError({"detail": "You have already reviewed this course."})
        serializer.save(user=self.request.user, course=course)


class CourseReviewRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """
    PUT/PATCH -> Update user's own review
    DELETE    -> Delete user's own review
    """
    serializer_class = CourseReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        course = get_object_or_404(Course, slug=self.kwargs['slug'])
        return CourseReview.objects.filter(course=course, user=self.request.user)


class PublicCourseReviewListView(generics.ListAPIView):
    """
    Public view: Anyone can see course reviews (read-only).
    """
    serializer_class = CourseReviewSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        slug = self.kwargs.get('slug')
        course = get_object_or_404(Course, slug=slug)
        return CourseReview.objects.filter(course=course).order_by('-created_at')


# --------------------------
# Chapters & Topics For Teacher/Admin
# --------------------------

class CourseChapterListCreateView(generics.ListCreateAPIView):
    serializer_class = CourseChapterSerializer
    permission_classes = [IsTeacherOrAdmin]

    def get_queryset(self):
        course_id = self.kwargs.get('course_id')
        return CourseChapter.objects.filter(course_id=course_id)

    def perform_create(self, serializer):
        course_id = self.kwargs.get('course_id')
        serializer.save(course_id=course_id)


class CourseChapterRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CourseChapter.objects.all()
    serializer_class = CourseChapterSerializer
    permission_classes = [IsTeacherOrAdmin]


class ChapterTopicListCreateView(generics.ListCreateAPIView):
    serializer_class = ChapterTopicSerializer
    permission_classes = [IsTeacherOrAdmin]

    def get_queryset(self):
        chapter_id = self.kwargs.get('chapter_id')
        return ChapterTopic.objects.filter(chapter_id=chapter_id)

    def perform_create(self, serializer):
        chapter_id = self.kwargs.get('chapter_id')
        serializer.save(chapter_id=chapter_id)


class ChapterTopicRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ChapterTopic.objects.all()
    serializer_class = ChapterTopicSerializer
    permission_classes = [IsTeacherOrAdmin]





# --------------------------
# Excel Upload/Export Views
# --------------------------

class CourseBulkUploadView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({"error": "No file uploaded"}, status=400)

        try:
            df = pd.read_excel(file_obj) if file_obj.name.endswith('.xlsx') else pd.read_csv(file_obj)
            created_courses = []
            for _, row in df.iterrows():
                serializer = AdminCourseSerializer(data=row.to_dict(), context={'request': request})
                if serializer.is_valid():
                    serializer.save()
                    created_courses.append(serializer.data)
                else:
                    return Response({"error": serializer.errors}, status=400)
            return Response({"created": created_courses}, status=201)
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class CourseExportView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        courses = Course.objects.all()
        serializer = AdminCourseSerializer(courses, many=True)
        df = pd.DataFrame(serializer.data)

        buffer = BytesIO()
        df.to_excel(buffer, index=False)
        buffer.seek(0)

        response = HttpResponse(
            buffer,
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename="courses_export.xlsx"'
        return response


class CourseTemplateDownloadView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        columns = [
            'title', 'description', 'price', 'discount', 'referral_comission',
            'discount_end_date (YYYY-MM-DD)', 'otp_discount', 'course_type',
            'certificate', 'mode', 'duration', 'status'
        ]
        df = pd.DataFrame(columns=columns)

        buffer = BytesIO()
        df.to_excel(buffer, index=False)
        buffer.seek(0)

        response = HttpResponse(
            buffer,
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename="course_upload_template.xlsx"'
        return response

