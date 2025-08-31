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


# --------------------------
# Permissions
# --------------------------

class IsTeacherOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'teacher']

    def has_object_permission(self, request, view, obj):
        return request.user.role == 'admin' or obj.created_by == request.user


# --------------------------
# Filters & Pagination
# --------------------------

class CourseFilterMixin:
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['title', 'description', 'created_by__username', 'language__name', 'categories__name', 'level__name']
    filterset_fields = ['categories', 'level', 'language', 'mode', 'course_type', 'certificate']
    filterset_class = CourseFilter
    ordering_fields = ['price', 'rating', 'created_at']


class CoursePagination(PageNumberPagination):
    page_size = 10
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
    queryset = Course.objects.filter(status='PUBLISH')
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


class CourseRetrieveByIDAPIView(generics.RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'


# --------------------------
# Course Admin CRUD
# --------------------------

class CourseCreateAPIView(generics.CreateAPIView):
    serializer_class = CourseCreateSerializer
    permission_classes = [IsTeacherOrAdmin]


class CourseDetailBySlugAdminAPIView(generics.RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsTeacherOrAdmin]
    lookup_field = 'slug'


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

class CourseReviewListCreateView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = CourseReviewSerializer

    def get_queryset(self, course):
        return CourseReview.objects.filter(course=course)

    def get_course(self):
        return get_object_or_404(Course, slug=self.kwargs['slug'])

    def get(self, request, slug):
        course = self.get_course()
        reviews = self.get_queryset(course)
        serializer = self.serializer_class(reviews, many=True)
        return Response(serializer.data)

    def post(self, request, slug):
        course = self.get_course()
        if CourseReview.objects.filter(course=course, user=request.user).exists():
            return Response({"detail": "You have already reviewed this course."}, status=400)
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, course=course)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def put(self, request, slug):
        course = self.get_course()
        review = get_object_or_404(CourseReview, course=course, user=request.user)
        serializer = self.serializer_class(review, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, slug):
        course = self.get_course()
        review = get_object_or_404(CourseReview, course=course, user=request.user)
        review.delete()
        return Response(status=204)


class PublicCourseReviewListView(generics.ListAPIView):
    serializer_class = CourseReviewSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = PageNumberPagination

    def get_queryset(self):
        slug = self.kwargs['slug']
        course = get_object_or_404(Course, slug=slug)
        return CourseReview.objects.filter(course=course).select_related('user').order_by('-created_at')


class MyCourseReviewView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CourseReviewSerializer

    def get_object(self):
        slug = self.kwargs['slug']
        course = get_object_or_404(Course, slug=slug)
        return get_object_or_404(CourseReview, course=course, user=self.request.user)

# --------------------------
# Point-Based Views (Why Learn, Requirements, etc.)
# --------------------------

class CoursePointBaseViewMixin:
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        return self.model.objects.filter(course__id=course_id)

    def perform_create(self, serializer):
        course_id = self.kwargs['course_id']
        serializer.save(course_id=course_id)


class CourseWhyLearnView(CoursePointBaseViewMixin, generics.ListCreateAPIView):
    serializer_class = CourseWhyLearnSerializer
    model = CourseWhyLearn


class CourseWhoCanJoinView(CoursePointBaseViewMixin, generics.ListCreateAPIView):
    serializer_class = CourseWhoCanJoinSerializer
    model = CourseWhoCanJoin


class CourseCareerOpportunitiesView(CoursePointBaseViewMixin, generics.ListCreateAPIView):
    serializer_class = CourseCareerOpportunitiesSerializer
    model = CourseCareerOpportunities


class CourseRequirementsView(CoursePointBaseViewMixin, generics.ListCreateAPIView):
    serializer_class = CourseRequirementsSerializer
    model = CourseRequirements


class CourseWhatYouLearnView(CoursePointBaseViewMixin, generics.ListCreateAPIView):
    serializer_class = CourseWhatYouLearnSerializer
    model = CourseWhatYouLearn


# --------------------------
# Chapters & Topics
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