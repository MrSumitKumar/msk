# courses/admin_urls.py

from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    AdminCourseViewSet, AdminChapterViewSet, AdminTopicViewSet
)

router = DefaultRouter()
# Admin courses CRUD + extra actions (bulk, export, template)
router.register(r'courses', AdminCourseViewSet, basename='admin-course')

# Admin chapters nested under courses
router.register(r'courses/(?P<course_pk>[^/.]+)/chapters', AdminChapterViewSet, basename='admin-chapter')

# Admin topics nested under chapters
router.register(r'chapters/(?P<chapter_pk>[^/.]+)/topics', AdminTopicViewSet, basename='admin-topic')

urlpatterns = [
    path('', include(router.urls)),
]
