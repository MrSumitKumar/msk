# backend/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.contrib.sitemaps.views import sitemap
from courses.sitemaps import CourseSitemap

sitemaps = {
    'courses': CourseSitemap,
}

def api_root(request):
    return JsonResponse({"message": "API is working."})

urlpatterns = [
    path('', api_root),
    path('admin/', include('nested_admin.urls')),
    path('admin/', admin.site.urls),
    path('auth/', include('users.urls')),
    path('courses/admin/', include('courses.admin_urls')),
    path('courses/', include('courses.public_urls')),
    path('projects/', include('projects.urls')), 
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
