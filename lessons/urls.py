"""
URLs pour la gestion des leçons.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SubjectViewSet, ChapterViewSet, LessonViewSet

router = DefaultRouter()
router.register(r'subjects', SubjectViewSet)
router.register(r'chapters', ChapterViewSet)
router.register(r'lessons', LessonViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
