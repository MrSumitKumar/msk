from django.urls import path
from .views import *


urlpatterns = [

    # -------------------------------
    # ⚙️ Admin/Teacher course CRUD
    # -------------------------------
    path('create/', CourseCreateAPIView.as_view(), name='course-create'),
    path('<slug:slug>/update/', CourseUpdateAPIView.as_view(), name='course-update'),
    path('<slug:slug>/delete/', CourseDeleteAPIView.as_view(), name='course-delete'),

    # -------------------------------
    # 📂 Course meta (dropdown data)
    # -------------------------------
    path('categories/', CategoryListAPIView.as_view(), name='category-list'),
    path('labels/', CourseLevelListAPIView.as_view(), name='label-list'),
    path('languages/', CourseLanguageListAPIView.as_view(), name='language-list'),

    # -------------------------------
    # 📤 Excel: Import/Export
    # -------------------------------
    path('admin/bulk-upload/', CourseBulkUploadView.as_view(), name='course-bulk-upload'),
    path('admin/export/', CourseExportView.as_view(), name='course-export'),
    path('admin/download-template/', CourseTemplateDownloadView.as_view(), name='course-template-download'),

    # -------------------------------
    # ⭐ Reviews
    # -------------------------------
    path('<slug:slug>/reviews/', CourseReviewListCreateView.as_view(), name='course-reviews'),  # list + create
    path('<slug:slug>/reviews/me/', CourseReviewRetrieveUpdateDeleteView.as_view(), name='course-my-review'),  # update + delete user’s own review
    path('<slug:slug>/public-reviews/', PublicCourseReviewListView.as_view(), name='public-course-reviews'),

    # -------------------------------
    # 🧠 Course Point Info (Why Learn, etc.)
    # -------------------------------
    path('<int:course_id>/why-learn/', CourseWhyLearnView.as_view(), name='course-why-learn'),
    path('<int:course_id>/who-can-join/', CourseWhoCanJoinView.as_view(), name='course-who-can-join'),
    path('<int:course_id>/career-opportunities/', CourseCareerOpportunitiesView.as_view(), name='course-career-opportunities'),
    path('<int:course_id>/requirements/', CourseRequirementsView.as_view(), name='course-requirements'),
    path('<int:course_id>/what-you-learn/', CourseWhatYouLearnView.as_view(), name='course-what-you-learn'),

    # -------------------------------
    # 📚 Chapters (Admin/Teacher)
    # -------------------------------
    path('<int:course_id>/chapters/', CourseChapterListCreateView.as_view(), name='chapter-list-create'),
    path('chapters/<int:pk>/', CourseChapterRetrieveUpdateDeleteView.as_view(), name='chapter-detail-admin'),

    # -------------------------------
    # 📖 Topics (Admin/Teacher)
    # -------------------------------
    path('<int:chapter_id>/topics/', ChapterTopicListCreateView.as_view(), name='topic-list-create'),
    path('topics/<int:pk>/', ChapterTopicRetrieveUpdateDeleteView.as_view(), name='topic-detail-admin'),

    # -------------------------------
    # 🔍 Public course browsing
    # -------------------------------
    path('', CourseListAPIView.as_view(), name='course-list'),
    path('<slug:slug>/', PublicCourseDetailAPIView.as_view(), name='course-detail'),
    path('<slug:slug>/with-chapters/', PublicCourseWithChaptersAPIView.as_view(), name='course-detail-with-chapters'),
]
