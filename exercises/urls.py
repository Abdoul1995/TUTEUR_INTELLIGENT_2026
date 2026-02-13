"""
URLs pour la gestion des exercices.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExerciseViewSet, QuizViewSet

router = DefaultRouter()
router.register(r'exercises', ExerciseViewSet)
router.register(r'quizzes', QuizViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
