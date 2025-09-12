# courses/public_urls.py
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    CourseViewSet, CourseReviewViewSet,
    CategoryViewSet, LevelViewSet, LanguageViewSet
)

router = DefaultRouter()
# Courses (public)
router.register(r'courses', CourseViewSet, basename='course')

# Course reviews (public)
router.register(r'courses/(?P<slug>[^/.]+)/reviews', CourseReviewViewSet, basename='course-reviews')

# Meta data (dropdowns)
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'levels', LevelViewSet, basename='level')
router.register(r'languages', LanguageViewSet, basename='language')

urlpatterns = [
    path('', include(router.urls)),
]

