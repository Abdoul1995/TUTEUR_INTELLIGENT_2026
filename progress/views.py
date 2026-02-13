"""
Vues pour le suivi de progression.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import datetime, timedelta
from .models import (
    StudentProgress, SubjectProgress, Skill, SkillMastery,
    WeakArea, Achievement, StudentAchievement, StudySession
)
from .serializers import (
    StudentProgressSerializer, SubjectProgressSerializer,
    SkillSerializer, SkillMasterySerializer, WeakAreaSerializer,
    AchievementSerializer, StudentAchievementSerializer,
    StudySessionSerializer, DashboardSerializer
)


class ProgressViewSet(viewsets.ViewSet):
    """ViewSet pour la progression."""
    
    permission_classes = [IsAuthenticated]
    
    def get_progress(self, user):
        """Récupérer ou créer la progression d'un utilisateur."""
        progress, created = StudentProgress.objects.get_or_create(student=user)
        return progress
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Récupérer le tableau de bord complet."""
        user = request.user
        
        # Progression globale
        progress = self.get_progress(user)
        progress.update_stats()
        
        # Progression par matière
        subject_progress = SubjectProgress.objects.filter(student=user)
        
        # Badges récents
        recent_achievements = StudentAchievement.objects.filter(
            student=user
        )[:5]
        
        # Zones faibles non résolues
        weak_areas = WeakArea.objects.filter(student=user, is_resolved=False)[:5]
        
        # Sessions récentes
        recent_sessions = StudySession.objects.filter(student=user)[:10]
        
        # Maîtrise des compétences
        skill_mastery = SkillMastery.objects.filter(student=user)
        
        data = {
            'progress': progress,
            'subject_progress': subject_progress,
            'recent_achievements': recent_achievements,
            'weak_areas': weak_areas,
            'recent_sessions': recent_sessions,
            'skill_mastery': skill_mastery
        }
        
        serializer = DashboardSerializer(data)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Récupérer les statistiques détaillées."""
        user = request.user
        progress = self.get_progress(user)
        progress.update_stats()
        
        # Statistiques sur 7 jours
        week_ago = timezone.now() - timedelta(days=7)
        
        from lessons.models import LessonView
        from exercises.models import ExerciseAttempt, QuizAttempt
        
        lessons_this_week = LessonView.objects.filter(
            student=user,
            viewed_at__gte=week_ago
        ).count()
        
        exercises_this_week = ExerciseAttempt.objects.filter(
            student=user,
            created_at__gte=week_ago
        ).count()
        
        quizzes_this_week = QuizAttempt.objects.filter(
            student=user,
            started_at__gte=week_ago
        ).count()
        
        # Score moyen
        avg_score = ExerciseAttempt.objects.filter(
            student=user
        ).aggregate(avg=models.Avg('score'))['avg'] or 0
        
        return Response({
            'total_lessons': progress.total_lessons_viewed,
            'total_exercises': progress.total_exercises_completed,
            'total_quizzes': progress.total_quizzes_completed,
            'total_points': progress.total_points,
            'current_streak': progress.current_streak,
            'lessons_this_week': lessons_this_week,
            'exercises_this_week': exercises_this_week,
            'quizzes_this_week': quizzes_this_week,
            'average_score': round(avg_score, 2)
        })
    
    @action(detail=False, methods=['post'])
    def update_streak(self, request):
        """Mettre à jour la série de l'élève."""
        progress = self.get_progress(request.user)
        
        today = timezone.now().date()
        if progress.last_activity:
            last_date = progress.last_activity.date()
            
            if last_date == today:
                # Déjà actif aujourd'hui
                pass
            elif last_date == today - timedelta(days=1):
                # Jour consécutif
                progress.current_streak += 1
                if progress.current_streak > progress.longest_streak:
                    progress.longest_streak = progress.current_streak
            else:
                # Série rompue
                progress.current_streak = 1
        else:
            progress.current_streak = 1
        
        progress.last_activity = timezone.now()
        progress.save()
        
        return Response({
            'current_streak': progress.current_streak,
            'longest_streak': progress.longest_streak
        })
    
    @action(detail=False, methods=['post'])
    def add_points(self, request):
        """Ajouter des points à l'élève."""
        points = request.data.get('points', 0)
        progress = self.get_progress(request.user)
        progress.total_points += points
        progress.save()
        
        return Response({'total_points': progress.total_points})


class SubjectProgressViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour la progression par matière."""
    
    serializer_class = SubjectProgressSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return SubjectProgress.objects.filter(student=self.request.user)


class SkillViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour les compétences."""
    
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Skill.objects.all()
        subject = self.request.query_params.get('subject', None)
        level = self.request.query_params.get('level', None)
        
        if subject:
            queryset = queryset.filter(subject__slug=subject)
        if level:
            queryset = queryset.filter(level=level)
        
        return queryset


class SkillMasteryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour la maîtrise des compétences."""
    
    serializer_class = SkillMasterySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return SkillMastery.objects.filter(student=self.request.user)
    
    @action(detail=True, methods=['post'])
    def update_level(self, request, pk=None):
        """Mettre à jour le niveau de maîtrise."""
        mastery = self.get_object()
        new_level = request.data.get('level')
        
        if new_level is not None and 0 <= new_level <= 4:
            mastery.level = new_level
            mastery.save()
            return Response(SkillMasterySerializer(mastery).data)
        
        return Response(
            {'error': 'Niveau invalide'},
            status=status.HTTP_400_BAD_REQUEST
        )


class WeakAreaViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour les zones faibles."""
    
    serializer_class = WeakAreaSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return WeakArea.objects.filter(
            student=self.request.user,
            is_resolved=False
        )
    
    @action(detail=True, methods=['post'])
    def mark_resolved(self, request, pk=None):
        """Marquer une zone faible comme résolue."""
        weak_area = self.get_object()
        weak_area.is_resolved = True
        weak_area.resolved_at = timezone.now()
        weak_area.save()
        
        return Response({'message': 'Zone faible marquée comme résolue'})


class AchievementViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour les badges."""
    
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    permission_classes = [IsAuthenticated]


class StudentAchievementViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour les badges des élèves."""
    
    serializer_class = StudentAchievementSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return StudentAchievement.objects.filter(student=self.request.user)


class StudySessionViewSet(viewsets.ModelViewSet):
    """ViewSet pour les sessions d'étude."""
    
    serializer_class = StudySessionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return StudySession.objects.filter(student=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(student=self.request.user)
    
    @action(detail=True, methods=['post'])
    def end(self, request, pk=None):
        """Terminer une session d'étude."""
        session = self.get_object()
        session.ended_at = timezone.now()
        
        if session.started_at:
            duration = (session.ended_at - session.started_at).seconds // 60
            session.duration = duration
        
        session.save()
        return Response(StudySessionSerializer(session).data)


# Import pour les statistiques
from django.db import models
