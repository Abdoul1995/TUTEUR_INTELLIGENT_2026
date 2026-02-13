"""
URL configuration for Tuteur Intelligent project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/lessons/', include('lessons.urls')),
    path('api/exercises/', include('exercises.urls')),
    path('api/progress/', include('progress.urls')),
    path('api/ai/', include('ai_tutor.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
