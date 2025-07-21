from django.urls import path
from .views import (
    CourseListAPIView,
    CategoryListAPIView,
    CourseLevelListAPIView,
    CourseLanguageListAPIView,
)

urlpatterns = [
    path('', CourseListAPIView.as_view(), name='course-list'),
    path('categories/', CategoryListAPIView.as_view(), name='category-list'),
    path('labels/', CourseLevelListAPIView.as_view(), name='label-list'),
    path('languages/', CourseLanguageListAPIView.as_view(), name='language-list'),
]
