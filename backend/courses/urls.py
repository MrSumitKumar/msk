from django.urls import path
from .views import (
    # Courses
    CourseListAPIView,
    PublicCourseDetailAPIView,
    CourseRetrieveByIDAPIView,
    CourseCreateAPIView,
    CourseDetailBySlugAdminAPIView,
    CourseUpdateAPIView,
    CourseDeleteAPIView,

    # Meta data
    CategoryListAPIView,
    CourseLevelListAPIView,
    CourseLanguageListAPIView,

    # Excel import/export
    CourseBulkUploadView,
    CourseExportView,
    CourseTemplateDownloadView,

    # Reviews
    CourseReviewListCreateView,
    PublicCourseReviewListView,
    MyCourseReviewView,

    # Points
    CourseWhyLearnView,
    CourseWhoCanJoinView,
    CourseCareerOpportunitiesView,
    CourseRequirementsView,
    CourseWhatYouLearnView,

    # Chapters & Topics
    CourseChapterListCreateView,
    CourseChapterRetrieveUpdateDeleteView,
    ChapterTopicListCreateView,
    ChapterTopicRetrieveUpdateDeleteView,
)

urlpatterns = [

    # -------------------------------
    # ⚙️ Admin/Teacher course CRUD
    # -------------------------------
    path('create/', CourseCreateAPIView.as_view(), name='course-create'),
    path('<slug:slug>/detail/', CourseDetailBySlugAdminAPIView.as_view(), name='course-detail-admin'),
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
    path('<slug:slug>/reviews/', CourseReviewListCreateView.as_view(), name='course-reviews'),
    path('<slug:slug>/public-reviews/', PublicCourseReviewListView.as_view(), name='public-course-reviews'),
    path('<slug:slug>/my-review/', MyCourseReviewView.as_view(), name='my-course-review'),

    # -------------------------------
    # 💳 EMI Plans
    # -------------------------------

    # -------------------------------
    # 🧠 Course Point Info (Why Learn, etc.)
    # -------------------------------
    path('<int:course_id>/why-learn/', CourseWhyLearnView.as_view(), name='course-why-learn'),
    path('<int:course_id>/who-can-join/', CourseWhoCanJoinView.as_view(), name='course-who-can-join'),
    path('<int:course_id>/career-opportunities/', CourseCareerOpportunitiesView.as_view(), name='course-career-opportunities'),
    path('<int:course_id>/requirements/', CourseRequirementsView.as_view(), name='course-requirements'),
    path('<int:course_id>/what-you-learn/', CourseWhatYouLearnView.as_view(), name='course-what-you-learn'),

    # -------------------------------
    # 📚 Chapters
    # -------------------------------
    path('<int:course_id>/chapters/', CourseChapterListCreateView.as_view(), name='chapter-list-create'),
    path('chapters/<int:pk>/', CourseChapterRetrieveUpdateDeleteView.as_view(), name='chapter-detail'),

    # -------------------------------
    # 📖 Topics
    # -------------------------------
    path('<int:chapter_id>/topics/', ChapterTopicListCreateView.as_view(), name='topic-list-create'),
    path('topics/<int:pk>/', ChapterTopicRetrieveUpdateDeleteView.as_view(), name='topic-detail'),

    # -------------------------------
    # 🔍 Public course browsing (leave <slug:slug> LAST)
    # -------------------------------
    path('', CourseListAPIView.as_view(), name='course-list'),
    path('id/<int:id>/', CourseRetrieveByIDAPIView.as_view(), name='course-detail-by-id'),
    path('<slug:slug>/', PublicCourseDetailAPIView.as_view(), name='course-detail'),
]