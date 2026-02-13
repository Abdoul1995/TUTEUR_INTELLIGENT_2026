"""
URLs pour le suivi de progression.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProgressViewSet, SubjectProgressViewSet, SkillViewSet,
    SkillMasteryViewSet, WeakAreaViewSet, AchievementViewSet,
    StudentAchievementViewSet, StudySessionViewSet
)

router = DefaultRouter()
router.register(r'subjects', SubjectProgressViewSet, basename='subject-progress')
router.register(r'skills', SkillViewSet)
router.register(r'skill-mastery', SkillMasteryViewSet, basename='skill-mastery')
router.register(r'weak-areas', WeakAreaViewSet, basename='weak-areas')
router.register(r'achievements', AchievementViewSet)
router.register(r'my-achievements', StudentAchievementViewSet, basename='my-achievements')
router.register(r'sessions', StudySessionViewSet, basename='sessions')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', ProgressViewSet.as_view({'get': 'dashboard'}), name='dashboard'),
    path('stats/', ProgressViewSet.as_view({'get': 'stats'}), name='stats'),
    path('update-streak/', ProgressViewSet.as_view({'post': 'update_streak'}), name='update-streak'),
    path('add-points/', ProgressViewSet.as_view({'post': 'add_points'}), name='add-points'),
]
