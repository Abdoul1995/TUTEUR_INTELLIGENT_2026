"""
Modèles pour le suivi de progression.
"""
from django.db import models
from django.contrib.auth import get_user_model
from lessons.models import Subject, Lesson
from exercises.models import Exercise, Quiz

User = get_user_model()


class StudentProgress(models.Model):
    """Progression globale d'un élève."""
    
    student = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='progress',
        verbose_name='Élève',
        limit_choices_to={'user_type': 'student'}
    )
    total_lessons_viewed = models.PositiveIntegerField(
        default=0,
        verbose_name='Leçons vues'
    )
    total_exercises_completed = models.PositiveIntegerField(
        default=0,
        verbose_name='Exercices complétés'
    )
    total_quizzes_completed = models.PositiveIntegerField(
        default=0,
        verbose_name='Quiz complétés'
    )
    total_points = models.PositiveIntegerField(
        default=0,
        verbose_name='Points totaux'
    )
    current_streak = models.PositiveIntegerField(
        default=0,
        verbose_name='Série actuelle (jours)'
    )
    longest_streak = models.PositiveIntegerField(
        default=0,
        verbose_name='Plus longue série'
    )
    last_activity = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name='Dernière activité'
    )
    weekly_goal = models.PositiveIntegerField(
        default=5,
        verbose_name='Objectif hebdomadaire (leçons)'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Progression de l\'élève'
        verbose_name_plural = 'Progressions des élèves'
    
    def __str__(self):
        return f"Progression de {self.student}"
    
    def update_stats(self):
        """Mettre à jour les statistiques."""
        from lessons.models import LessonView
        from exercises.models import ExerciseAttempt, QuizAttempt
        
        self.total_lessons_viewed = LessonView.objects.filter(
            student=self.student
        ).count()
        
        self.total_exercises_completed = ExerciseAttempt.objects.filter(
            student=self.student,
            is_correct=True
        ).count()
        
        self.total_quizzes_completed = QuizAttempt.objects.filter(
            student=self.student,
            completed=True
        ).count()
        
        self.save()


class SubjectProgress(models.Model):
    """Progression par matière."""
    
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='subject_progress',
        verbose_name='Élève'
    )
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name='student_progress',
        verbose_name='Matière'
    )
    lessons_completed = models.PositiveIntegerField(
        default=0,
        verbose_name='Leçons complétées'
    )
    total_lessons = models.PositiveIntegerField(
        default=0,
        verbose_name='Total des leçons'
    )
    exercises_completed = models.PositiveIntegerField(
        default=0,
        verbose_name='Exercices complétés'
    )
    average_score = models.FloatField(
        default=0.0,
        verbose_name='Score moyen'
    )
    mastery_level = models.PositiveIntegerField(
        default=1,
        verbose_name='Niveau de maîtrise'
    )
    
    class Meta:
        unique_together = ['student', 'subject']
        verbose_name = 'Progression par matière'
        verbose_name_plural = 'Progressions par matière'
    
    def __str__(self):
        return f"{self.student} - {self.subject}"
    
    @property
    def completion_percentage(self):
        if self.total_lessons > 0:
            return int((self.lessons_completed / self.total_lessons) * 100)
        return 0


class Skill(models.Model):
    """Compétence à maîtriser."""
    
    name = models.CharField(max_length=200, verbose_name='Nom')
    description = models.TextField(blank=True, verbose_name='Description')
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name='skills',
        verbose_name='Matière'
    )
    level = models.CharField(
        max_length=20,
        choices=Lesson.LEVEL_CHOICES,
        verbose_name='Niveau'
    )
    prerequisites = models.ManyToManyField(
        'self',
        blank=True,
        symmetrical=False,
        verbose_name='Prérequis'
    )
    
    class Meta:
        verbose_name = 'Compétence'
        verbose_name_plural = 'Compétences'
    
    def __str__(self):
        return self.name


class SkillMastery(models.Model):
    """Maîtrise d'une compétence par un élève."""
    
    MASTERY_LEVELS = [
        (0, 'Non commencé'),
        (1, 'Débutant'),
        (2, 'Intermédiaire'),
        (3, 'Avancé'),
        (4, 'Expert'),
    ]
    
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='skill_mastery',
        verbose_name='Élève'
    )
    skill = models.ForeignKey(
        Skill,
        on_delete=models.CASCADE,
        related_name='mastery_records',
        verbose_name='Compétence'
    )
    level = models.PositiveIntegerField(
        choices=MASTERY_LEVELS,
        default=0,
        verbose_name='Niveau de maîtrise'
    )
    attempts = models.PositiveIntegerField(
        default=0,
        verbose_name='Tentatives'
    )
    successes = models.PositiveIntegerField(
        default=0,
        verbose_name='Succès'
    )
    last_attempt = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name='Dernière tentative'
    )
    
    class Meta:
        unique_together = ['student', 'skill']
        verbose_name = 'Maîtrise de compétence'
        verbose_name_plural = 'Maîtrises de compétences'
    
    def __str__(self):
        return f"{self.student} - {self.skill} ({self.get_level_display()})"
    
    @property
    def success_rate(self):
        if self.attempts > 0:
            return int((self.successes / self.attempts) * 100)
        return 0


class WeakArea(models.Model):
    """Zone faible identifiée pour un élève."""
    
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='weak_areas',
        verbose_name='Élève'
    )
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name='weak_areas',
        verbose_name='Matière'
    )
    concept = models.CharField(max_length=200, verbose_name='Concept')
    description = models.TextField(blank=True, verbose_name='Description')
    error_count = models.PositiveIntegerField(
        default=0,
        verbose_name='Nombre d\'erreurs'
    )
    recommended_lessons = models.ManyToManyField(
        Lesson,
        blank=True,
        verbose_name='Leçons recommandées'
    )
    recommended_exercises = models.ManyToManyField(
        Exercise,
        blank=True,
        verbose_name='Exercices recommandés'
    )
    is_resolved = models.BooleanField(
        default=False,
        verbose_name='Résolu'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        verbose_name = 'Zone faible'
        verbose_name_plural = 'Zones faibles'
        ordering = ['-error_count']
    
    def __str__(self):
        return f"{self.student} - {self.concept}"


class Achievement(models.Model):
    """Badge de réussite."""
    
    ACHIEVEMENT_TYPES = [
        ('streak', 'Série'),
        ('lessons', 'Leçons'),
        ('exercises', 'Exercices'),
        ('quizzes', 'Quiz'),
        ('score', 'Score'),
        ('mastery', 'Maîtrise'),
        ('special', 'Spécial'),
    ]
    
    name = models.CharField(max_length=100, verbose_name='Nom')
    description = models.TextField(verbose_name='Description')
    achievement_type = models.CharField(
        max_length=20,
        choices=ACHIEVEMENT_TYPES,
        verbose_name='Type'
    )
    icon = models.CharField(max_length=50, verbose_name='Icône')
    color = models.CharField(max_length=7, default='#FFD700', verbose_name='Couleur')
    requirement = models.PositiveIntegerField(
        default=1,
        verbose_name='Condition requise'
    )
    
    class Meta:
        verbose_name = 'Badge'
        verbose_name_plural = 'Badges'
    
    def __str__(self):
        return self.name


class StudentAchievement(models.Model):
    """Badge obtenu par un élève."""
    
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='achievements',
        verbose_name='Élève'
    )
    achievement = models.ForeignKey(
        Achievement,
        on_delete=models.CASCADE,
        related_name='students',
        verbose_name='Badge'
    )
    earned_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['student', 'achievement']
        verbose_name = 'Badge de l\'élève'
        verbose_name_plural = 'Badges des élèves'
        ordering = ['-earned_at']
    
    def __str__(self):
        return f"{self.student} - {self.achievement}"


class StudySession(models.Model):
    """Session d'étude d'un élève."""
    
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='study_sessions',
        verbose_name='Élève'
    )
    subject = models.ForeignKey(
        Subject,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name='Matière'
    )
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(blank=True, null=True)
    duration = models.PositiveIntegerField(
        default=0,
        verbose_name='Durée (minutes)'
    )
    lessons_viewed = models.ManyToManyField(
        Lesson,
        blank=True,
        verbose_name='Leçons vues'
    )
    exercises_completed = models.PositiveIntegerField(
        default=0,
        verbose_name='Exercices complétés'
    )
    
    class Meta:
        verbose_name = 'Session d\'étude'
        verbose_name_plural = 'Sessions d\'étude'
        ordering = ['-started_at']
    
    def __str__(self):
        return f"Session de {self.student} - {self.started_at}"
