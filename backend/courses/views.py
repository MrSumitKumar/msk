# courses/views.py

from rest_framework import viewsets, permissions, filters, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework.decorators import action, api_view, permission_classes
from django.shortcuts import get_object_or_404
from django.db.models import Avg, Count, Prefetch
from rest_framework.exceptions import ValidationError
from django.http import HttpResponse
from django_filters.rest_framework import DjangoFilterBackend

from .models import *
from .serializers import *
from .course_filters import CourseFilter
from rest_framework import filters as drf_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import AllowAny
from rest_framework.authentication import BasicAuthentication


import pandas as pd
from io import BytesIO

# --------------------------
# Certificate Verification View
# --------------------------

@api_view(['GET'])
@permission_classes([AllowAny])
def verify_certificate(request, enrollment_no):
    """
    Verify a certificate using enrollment number.
    Returns enrollment details if valid certificate exists.
    """
    try:
        enrollment = Enrollment.objects.select_related(
            'user', 
            'course',
            'course__level'
        ).get(
            enrollment_no=enrollment_no,
            certificate=True,
            payment_complete=True,
            status=Enrollment.StatusChoices.APPROVED
        )
        
        data = {
            'valid': True,
            # Student Details
            'student': {
                'name': f"{enrollment.user.first_name} {enrollment.user.last_name}",
                'profile_image': enrollment.user.picture.url if enrollment.user.picture else None,
                'enrollment_no': enrollment.enrollment_no,
                'dob': enrollment.user.date_of_birth,
            },
            # Course Details
            'course': {
                'name': enrollment.course.title,
                'slug': enrollment.course.slug,
                'thumbnail': enrollment.course.featured_image.url if enrollment.course.featured_image else None,
                'level': enrollment.course.level.name if enrollment.course.level else None,
                'duration': enrollment.course.duration,
                'description': enrollment.course.sort_description[:200] + '...' if enrollment.course.sort_description and len(enrollment.course.sort_description) > 200 else (enrollment.course.sort_description or ''),
            },
            # Certificate Details
            'certificate': {
                'enrollment_date': enrollment.enrolled_at,
                'completion_date': enrollment.end_at,
            },
            # Marketing Section
            'marketing': {
                'course_url': f"/courses/{enrollment.course.slug}",
                'total_students': enrollment.course.enrollments.filter(status=Enrollment.StatusChoices.APPROVED).count(),
                'rating': enrollment.course.reviews.aggregate(avg_rating=Avg('rating'))['avg_rating'] or 0,
                'review_count': enrollment.course.reviews.count(),
                'next_batch_start': enrollment.course.next_batch_date if hasattr(enrollment.course, 'next_batch_date') else None,
                'success_story': "Join thousands of successful students who have transformed their career with our courses!",
                'cta_text': "Enroll now and start your journey to success!",
            }
        }
        return Response(data)
    except Enrollment.DoesNotExist:
        return Response({
            'valid': False,
            'message': 'Invalid certificate. No matching enrollment found with this number.'
        }, status=status.HTTP_404_NOT_FOUND)

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
    - Anyone can READ (GET/HEAD/OPTIONS).
    - WRITE only for Teacher/Admin.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role in ['admin', 'teacher']

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.role == 'admin' or obj.created_by == request.user


# --------------------------
# Pagination
# --------------------------

class CoursePagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100


# --------------------------
# Public / Student ViewSets
# --------------------------

class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public: list & detail of courses
    """
    serializer_class = PublicCourseDetailSerializer
    lookup_field = "slug"
    permission_classes = [AllowAny]
    authentication_classes = []
    pagination_class = CoursePagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = CourseFilter

    def get_queryset(self):
        return Course.objects.filter(status='PUBLISH').select_related('level', 'created_by').prefetch_related('categories', 'language')

    @action(detail=True, methods=['get'])
    def with_chapters(self, request, slug=None):
        course = get_object_or_404(
            Course.objects.prefetch_related(
                'single_courses',
                Prefetch(
                    'chapters',
                    queryset=CourseChapter.objects.prefetch_related(
                        Prefetch('topics', queryset=ChapterTopic.objects.order_by('id'))
                    ).order_by('id')
                )
            ).select_related('level', 'created_by').prefetch_related('categories', 'language'),
            slug=slug
        )
        serializer = CourseDetailWithChaptersSerializer(course, context={'request': request})
        return Response(serializer.data)

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'with_chapters']:
            return [AllowAny()]
        return super().get_permissions()




class CourseReviewViewSet(viewsets.ModelViewSet):
    """
    Public: list reviews
    Authenticated: create/update/delete own review
    """
    serializer_class = CourseReviewSerializer
    lookup_field = 'pk'

    def get_permissions(self):
        if self.action in ['list', 'public']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        slug = self.kwargs.get('slug')
        course = get_object_or_404(Course, slug=slug)
        if self.action in ['list', 'public']:
            return CourseReview.objects.filter(course=course).order_by('-created_at')
        return CourseReview.objects.filter(course=course, user=self.request.user)

    def perform_create(self, serializer):
        slug = self.kwargs.get('slug')
        course = get_object_or_404(Course, slug=slug)
        if CourseReview.objects.filter(course=course, user=self.request.user).exists():
            raise ValidationError({"detail": "You have already reviewed this course."})
        serializer.save(user=self.request.user, course=course)

    @action(detail=False, methods=['get'], url_path='public', permission_classes=[permissions.AllowAny])
    def public(self, request, slug=None):
        """Public listing of reviews"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


# --------------------------
# Admin / Teacher ViewSets
# --------------------------

class AdminCourseViewSet(viewsets.ModelViewSet):
    """
    Admin/Teacher: CRUD courses
    """
    queryset = Course.objects.all()
    serializer_class = AdminCourseSerializer
    lookup_field = 'slug'
    permission_classes = [IsTeacherOrAdmin]
    parser_classes = [MultiPartParser]

    @action(detail=False, methods=['post'])
    def bulk_upload(self, request):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({"error": "No file uploaded"}, status=400)
        try:
            df = pd.read_excel(file_obj) if file_obj.name.endswith('.xlsx') else pd.read_csv(file_obj)
            created_courses = []
            errors = []
            for i, row in df.iterrows():
                serializer = AdminCourseSerializer(data=row.to_dict(), context={'request': request})
                if serializer.is_valid():
                    serializer.save(created_by=request.user)
                    created_courses.append(serializer.data)
                else:
                    errors.append({"row": i + 1, "errors": serializer.errors})
            if errors:
                return Response({"errors": errors}, status=400)
            return Response({"created": created_courses}, status=201)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

    @action(detail=False, methods=['get'])
    def export(self, request):
        courses = self.get_queryset()
        serializer = AdminCourseSerializer(courses, many=True)
        df = pd.DataFrame(serializer.data)
        buffer = BytesIO()
        df.to_excel(buffer, index=False, engine='openpyxl')
        buffer.seek(0)
        response = HttpResponse(buffer, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename="courses_export.xlsx"'
        return response

    @action(detail=False, methods=['get'])
    def template(self, request):
        columns = [
            'title', 'description', 'price', 'discount', 'discount_end_date (YYYY-MM-DD)',
            'otp_discount', 'course_type', 'certificate', 'mode', 'duration', 'status'
        ]
        df = pd.DataFrame(columns=columns)
        buffer = BytesIO()
        df.to_excel(buffer, index=False, engine='openpyxl')
        buffer.seek(0)
        response = HttpResponse(buffer, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename="course_upload_template.xlsx"'
        return response


class AdminChapterViewSet(viewsets.ModelViewSet):
    queryset = CourseChapter.objects.all()
    serializer_class = CourseChapterSerializer
    permission_classes = [IsTeacherOrAdmin]

    def get_queryset(self):
        course_id = self.kwargs.get('course_pk')
        return CourseChapter.objects.filter(course_id=course_id)


class AdminTopicViewSet(viewsets.ModelViewSet):
    queryset = ChapterTopic.objects.all()
    serializer_class = ChapterTopicSerializer
    permission_classes = [IsTeacherOrAdmin]

    def get_queryset(self):
        chapter_id = self.kwargs.get('chapter_pk')
        return ChapterTopic.objects.filter(chapter_id=chapter_id)


# --------------------------
# Meta / dropdown views
# --------------------------

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class LevelViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Level.objects.all().order_by('name')
    serializer_class = CourseLevelSerializer
    permission_classes = [permissions.AllowAny]


class LanguageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Language.objects.all().order_by('name')
    serializer_class = CourseLanguageSerializer
    permission_classes = [permissions.AllowAny]

