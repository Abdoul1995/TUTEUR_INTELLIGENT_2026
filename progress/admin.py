"""
Admin pour le suivi de progression.
"""
from django.contrib import admin
from .models import (
    StudentProgress, SubjectProgress, Skill, SkillMastery,
    WeakArea, Achievement, StudentAchievement, StudySession
)


@admin.register(StudentProgress)
class StudentProgressAdmin(admin.ModelAdmin):
    """Admin pour la progression globale."""
    
    list_display = [
        'student', 'total_lessons_viewed', 'total_exercises_completed',
        'total_quizzes_completed', 'total_points', 'current_streak',
        'last_activity'
    ]
    search_fields = ['student__username']


@admin.register(SubjectProgress)
class SubjectProgressAdmin(admin.ModelAdmin):
    """Admin pour la progression par matière."""
    
    list_display = [
        'student', 'subject', 'lessons_completed',
        'total_lessons', 'average_score', 'mastery_level'
    ]
    list_filter = ['subject']
    search_fields = ['student__username']


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    """Admin pour les compétences."""
    
    list_display = ['name', 'subject', 'level']
    list_filter = ['subject', 'level']
    search_fields = ['name', 'description']


@admin.register(SkillMastery)
class SkillMasteryAdmin(admin.ModelAdmin):
    """Admin pour la maîtrise des compétences."""
    
    list_display = ['student', 'skill', 'level', 'success_rate']
    list_filter = ['level']
    search_fields = ['student__username', 'skill__name']
    
    def success_rate(self, obj):
        return f"{obj.success_rate}%"
    success_rate.short_description = 'Taux de réussite'


@admin.register(WeakArea)
class WeakAreaAdmin(admin.ModelAdmin):
    """Admin pour les zones faibles."""
    
    list_display = ['student', 'subject', 'concept', 'error_count', 'is_resolved']
    list_filter = ['is_resolved', 'subject']
    search_fields = ['student__username', 'concept']


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    """Admin pour les badges."""
    
    list_display = ['name', 'achievement_type', 'requirement']
    list_filter = ['achievement_type']
    search_fields = ['name', 'description']


@admin.register(StudentAchievement)
class StudentAchievementAdmin(admin.ModelAdmin):
    """Admin pour les badges des élèves."""
    
    list_display = ['student', 'achievement', 'earned_at']
    list_filter = ['earned_at']
    search_fields = ['student__username', 'achievement__name']


@admin.register(StudySession)
class StudySessionAdmin(admin.ModelAdmin):
    """Admin pour les sessions d'étude."""
    
    list_display = ['student', 'subject', 'started_at', 'duration']
    list_filter = ['started_at']
    search_fields = ['student__username']
