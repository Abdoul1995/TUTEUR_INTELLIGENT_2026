"""
Sérialiseurs pour le suivi de progression.
"""
from rest_framework import serializers
from .models import (
    StudentProgress, SubjectProgress, Skill, SkillMastery,
    WeakArea, Achievement, StudentAchievement, StudySession
)


class StudentProgressSerializer(serializers.ModelSerializer):
    """Sérialiseur pour la progression globale."""
    
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    weekly_progress = serializers.SerializerMethodField()
    
    class Meta:
        model = StudentProgress
        fields = [
            'id', 'student', 'student_name', 'total_lessons_viewed',
            'total_exercises_completed', 'total_quizzes_completed',
            'total_points', 'current_streak', 'longest_streak',
            'last_activity', 'weekly_goal', 'weekly_progress',
            'created_at', 'updated_at'
        ]
    
    def get_weekly_progress(self, obj):
        """Calculer la progression hebdomadaire."""
        from lessons.models import LessonView
        from datetime import datetime, timedelta
        
        week_ago = datetime.now() - timedelta(days=7)
        lessons_this_week = LessonView.objects.filter(
            student=obj.student,
            viewed_at__gte=week_ago
        ).count()
        
        return {
            'lessons_this_week': lessons_this_week,
            'goal': obj.weekly_goal,
            'percentage': min(100, int((lessons_this_week / obj.weekly_goal) * 100)) if obj.weekly_goal > 0 else 0
        }


class SubjectProgressSerializer(serializers.ModelSerializer):
    """Sérialiseur pour la progression par matière."""
    
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    subject_color = serializers.CharField(source='subject.color', read_only=True)
    completion_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = SubjectProgress
        fields = [
            'id', 'subject', 'subject_name', 'subject_color',
            'lessons_completed', 'total_lessons', 'completion_percentage',
            'exercises_completed', 'average_score', 'mastery_level'
        ]


class SkillSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les compétences."""
    
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    
    class Meta:
        model = Skill
        fields = ['id', 'name', 'description', 'subject', 'subject_name', 'level']


class SkillMasterySerializer(serializers.ModelSerializer):
    """Sérialiseur pour la maîtrise des compétences."""
    
    skill_name = serializers.CharField(source='skill.name', read_only=True)
    level_display = serializers.CharField(source='get_level_display', read_only=True)
    success_rate = serializers.ReadOnlyField()
    
    class Meta:
        model = SkillMastery
        fields = [
            'id', 'skill', 'skill_name', 'level', 'level_display',
            'attempts', 'successes', 'success_rate', 'last_attempt'
        ]


class WeakAreaSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les zones faibles."""
    
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    recommended_lessons_count = serializers.SerializerMethodField()
    
    class Meta:
        model = WeakArea
        fields = [
            'id', 'subject', 'subject_name', 'concept', 'description',
            'error_count', 'recommended_lessons_count', 'is_resolved',
            'created_at', 'resolved_at'
        ]
    
    def get_recommended_lessons_count(self, obj):
        return obj.recommended_lessons.count()


class AchievementSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les badges."""
    
    type_display = serializers.CharField(source='get_achievement_type_display', read_only=True)
    
    class Meta:
        model = Achievement
        fields = [
            'id', 'name', 'description', 'achievement_type', 'type_display',
            'icon', 'color', 'requirement'
        ]


class StudentAchievementSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les badges des élèves."""
    
    achievement_details = AchievementSerializer(source='achievement', read_only=True)
    
    class Meta:
        model = StudentAchievement
        fields = ['id', 'achievement', 'achievement_details', 'earned_at']


class StudySessionSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les sessions d'étude."""
    
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    
    class Meta:
        model = StudySession
        fields = [
            'id', 'subject', 'subject_name', 'started_at', 'ended_at',
            'duration', 'exercises_completed'
        ]


class DashboardSerializer(serializers.Serializer):
    """Sérialiseur pour le tableau de bord."""
    
    progress = StudentProgressSerializer()
    subject_progress = SubjectProgressSerializer(many=True)
    recent_achievements = StudentAchievementSerializer(many=True)
    weak_areas = WeakAreaSerializer(many=True)
    recent_sessions = StudySessionSerializer(many=True)
    skill_mastery = SkillMasterySerializer(many=True)
