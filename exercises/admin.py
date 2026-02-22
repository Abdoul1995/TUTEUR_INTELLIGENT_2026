"""
Admin pour les exercices.
"""
from django.contrib import admin
from .models import Exercise, ExerciseAttempt, Quiz, QuizAttempt, ExerciseResource


class ExerciseResourceInline(admin.TabularInline):
    """Inline pour les ressources d'exercice."""
    model = ExerciseResource
    extra = 1


@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    """Admin pour les exercices."""
    
    list_display = [
        'title', 'exercise_type', 'difficulty', 'level',
        'subject', 'points', 'order', 'is_active'
    ]
    list_filter = ['exercise_type', 'difficulty', 'level', 'subject', 'is_active']
    search_fields = ['title', 'description']
    inlines = [ExerciseResourceInline]


@admin.register(ExerciseAttempt)
class ExerciseAttemptAdmin(admin.ModelAdmin):
    """Admin pour les tentatives d'exercice."""
    
    list_display = [
        'student', 'exercise', 'is_correct', 'score',
        'attempt_number', 'created_at'
    ]
    list_filter = ['is_correct', 'created_at']
    search_fields = ['student__username', 'exercise__title']


class ExerciseInline(admin.TabularInline):
    """Inline pour les exercices dans un quiz."""
    model = Quiz.exercises.through
    extra = 1


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    """Admin pour les quiz."""
    
    list_display = [
        'title', 'subject', 'level', 'exercise_count',
        'time_limit', 'passing_score', 'is_active'
    ]
    list_filter = ['level', 'subject', 'is_active']
    search_fields = ['title', 'description']
    inlines = [ExerciseInline]
    
    def exercise_count(self, obj):
        return obj.exercises.count()
    exercise_count.short_description = 'Exercices'


@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    """Admin pour les tentatives de quiz."""
    
    list_display = [
        'student', 'quiz', 'score', 'percentage',
        'is_passed', 'completed', 'started_at'
    ]
    list_filter = ['is_passed', 'completed', 'started_at']
    search_fields = ['student__username', 'quiz__title']
