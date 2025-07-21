from rest_framework import viewsets, permissions, serializers, generics, filters
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import NotFound
from rest_framework.generics import ListAPIView
from .models import (
    Course,
    Category,
    Label,
    CourseLanguage
)
from .serializers import (
    CourseSerializer,
    CategorySerializer,
    CourseLevelSerializer,
    CourseLanguageSerializer
)

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from rest_framework.renderers import JSONRenderer
from .filters import CourseFilter


class CategoryListAPIView(ListAPIView):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer

    def get_renderers(self):
        return [JSONRenderer()]

class CourseLevelListAPIView(ListAPIView):
    queryset = Label.objects.all().order_by('name')
    serializer_class = CourseLevelSerializer
    
    def get_renderers(self):
        return [JSONRenderer()]

class CourseLanguageListAPIView(ListAPIView):
    queryset = CourseLanguage.objects.all().order_by('name')
    serializer_class = CourseLanguageSerializer

    def get_renderers(self):
        return [JSONRenderer()]

class CourseListAPIView(generics.ListAPIView):
    queryset = Course.objects.filter(status='PUBLISH')
    serializer_class = CourseSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['title', 'description']
    filterset_fields = ['categories', 'level', 'language', 'mode', 'course_type', 'certificate']
    filterset_class = CourseFilter

    def get_renderers(self):
        return [JSONRenderer()]
    

class IsTeacherOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'teacher']

    def has_object_permission(self, request, view, obj):
        return request.user.role == 'admin' or obj.created_by == request.user

class CoursePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    lookup_field = 'slug' 
    pagination_class = CoursePagination
    ordering_fields = ['price', 'rating', 'created_at']

    queryset = Course.objects.filter(status='PUBLISH').order_by('-id')
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['title', 'description', 'teacher__username', 'language', 'category__name', 'level__name']

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role == 'admin':
            return Course.objects.all()
        elif user.is_authenticated and user.role == 'teacher':
            return Course.objects.filter(created_by=user)
        return Course.objects.filter(status='PUBLISH').order_by('-id')
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsTeacherOrAdmin()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        try:
            serializer.save(created_by=self.request.user)
        except Exception:
            raise serializers.ValidationError({"error": "Course could not be added. Please check input values."})

    def retrieve(self, request, *args, **kwargs):
        try:
            return super().retrieve(request, *args, **kwargs)
        except Course.DoesNotExist:
            raise NotFound(detail="Course not found.")
