"""
Modèles pour la gestion des exercices.
"""
from django.db import models
from django.contrib.auth import get_user_model
from lessons.models import Lesson, Subject

User = get_user_model()


class Exercise(models.Model):
    """Exercice pour les élèves."""
    
    DIFFICULTY_CHOICES = [
        ('easy', 'Facile'),
        ('medium', 'Moyen'),
        ('hard', 'Difficile'),
    ]
    
    EXERCISE_TYPES = [
        ('qcm', 'QCM'),
        ('classic', 'Classique (Fiche d\'exercices)'),
    ]
    
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name='exercises',
        verbose_name='Leçon',
        blank=True,
        null=True
    )
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name='exercises',
        verbose_name='Matière'
    )
    title = models.CharField(max_length=200, verbose_name='Titre')
    description = models.TextField(blank=True, verbose_name='Description')
    exercise_type = models.CharField(
        max_length=20,
        choices=EXERCISE_TYPES,
        default='qcm',
        verbose_name='Type d\'exercice'
    )
    difficulty = models.CharField(
        max_length=20,
        choices=DIFFICULTY_CHOICES,
        default='medium',
        verbose_name='Difficulté'
    )
    level = models.CharField(
        max_length=20,
        choices=Lesson.LEVEL_CHOICES,
        verbose_name='Niveau'
    )
    content = models.JSONField(verbose_name='Contenu (JSON)')
    correct_answers = models.JSONField(verbose_name='Réponses correctes')
    explanation = models.TextField(blank=True, verbose_name='Explication')
    hints = models.JSONField(default=list, blank=True, verbose_name='Indices')
    points = models.PositiveIntegerField(default=10, verbose_name='Points')
    time_limit = models.PositiveIntegerField(
        blank=True,
        null=True,
        verbose_name='Limite de temps (secondes)'
    )
    order = models.PositiveIntegerField(default=0, verbose_name='Ordre')
    is_active = models.BooleanField(default=True, verbose_name='Actif')
    creator = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name='created_exercises',
        verbose_name='Créateur',
        blank=True,
        null=True
    )
    is_ai_generated = models.BooleanField(default=False, verbose_name='Généré par IA')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Exercice'
        verbose_name_plural = 'Exercices'
        ordering = ['order', 'difficulty', 'title']
    
    def __str__(self):
        return f"{self.title} ({self.get_difficulty_display()})"


class ExerciseAttempt(models.Model):
    """Tentative d'exercice par un élève."""
    
    exercise = models.ForeignKey(
        Exercise,
        on_delete=models.CASCADE,
        related_name='attempts',
        verbose_name='Exercice'
    )
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='exercise_attempts',
        verbose_name='Élève'
    )
    answer = models.JSONField(verbose_name='Réponse donnée')
    is_correct = models.BooleanField(verbose_name='Correct')
    score = models.PositiveIntegerField(default=0, verbose_name='Score')
    time_spent = models.PositiveIntegerField(
        default=0,
        verbose_name='Temps passé (secondes)'
    )
    hints_used = models.PositiveIntegerField(
        default=0,
        verbose_name='Indices utilisés'
    )
    attempt_number = models.PositiveIntegerField(
        default=1,
        verbose_name='Numéro de tentative'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Tentative d\'exercice'
        verbose_name_plural = 'Tentatives d\'exercices'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.student} - {self.exercise} - {'✓' if self.is_correct else '✗'}"
    
    def save(self, *args, **kwargs):
        # Calculer le numéro de tentative
        if not self.pk:
            last_attempt = ExerciseAttempt.objects.filter(
                exercise=self.exercise,
                student=self.student
            ).order_by('-attempt_number').first()
            if last_attempt:
                self.attempt_number = last_attempt.attempt_number + 1
        super().save(*args, **kwargs)


class Quiz(models.Model):
    """Quiz composé de plusieurs exercices."""
    
    title = models.CharField(max_length=200, verbose_name='Titre')
    description = models.TextField(blank=True, verbose_name='Description')
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name='quizzes',
        verbose_name='Matière'
    )
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name='quizzes',
        verbose_name='Leçon',
        blank=True,
        null=True
    )
    exercises = models.ManyToManyField(
        Exercise,
        related_name='quizzes',
        verbose_name='Exercices'
    )
    level = models.CharField(
        max_length=20,
        choices=Lesson.LEVEL_CHOICES,
        verbose_name='Niveau'
    )
    time_limit = models.PositiveIntegerField(
        blank=True,
        null=True,
        verbose_name='Limite de temps totale (minutes)'
    )
    passing_score = models.PositiveIntegerField(
        default=50,
        verbose_name='Score de réussite (%)'
    )
    is_active = models.BooleanField(default=True, verbose_name='Actif')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Quiz'
        verbose_name_plural = 'Quiz'
    
    def __str__(self):
        return self.title


class QuizAttempt(models.Model):
    """Tentative de quiz par un élève."""
    
    quiz = models.ForeignKey(
        Quiz,
        on_delete=models.CASCADE,
        related_name='attempts',
        verbose_name='Quiz'
    )
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='quiz_attempts',
        verbose_name='Élève'
    )
    score = models.PositiveIntegerField(default=0, verbose_name='Score')
    total_score = models.PositiveIntegerField(default=0, verbose_name='Score total')
    percentage = models.PositiveIntegerField(default=0, verbose_name='Pourcentage')
    is_passed = models.BooleanField(default=False, verbose_name='Réussi')
    time_spent = models.PositiveIntegerField(
        default=0,
        verbose_name='Temps passé (secondes)'
    )
    completed = models.BooleanField(default=False, verbose_name='Terminé')
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        verbose_name = 'Tentative de quiz'
        verbose_name_plural = 'Tentatives de quiz'
        ordering = ['-started_at']
    
    def __str__(self):
        return f"{self.student} - {self.quiz} - {self.percentage}%"
