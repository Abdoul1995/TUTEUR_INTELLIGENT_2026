"""
Modèles pour la gestion des leçons.
"""
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Subject(models.Model):
    """Matière scolaire."""
    
    name = models.CharField(max_length=100, verbose_name='Nom')
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True, verbose_name='Description')
    icon = models.CharField(max_length=50, blank=True, verbose_name='Icône')
    color = models.CharField(max_length=7, default='#3B82F6', verbose_name='Couleur')
    order = models.PositiveIntegerField(default=0, verbose_name='Ordre')
    is_active = models.BooleanField(default=True, verbose_name='Actif')
    
    class Meta:
        verbose_name = 'Matière'
        verbose_name_plural = 'Matières'
        ordering = ['order', 'name']
    
    def __str__(self):
        return self.name


class Chapter(models.Model):
    """Chapitre d'une matière."""
    
    subject = models.ForeignKey(
        Subject, 
        on_delete=models.CASCADE, 
        related_name='chapters',
        verbose_name='Matière'
    )
    title = models.CharField(max_length=200, verbose_name='Titre')
    slug = models.SlugField()
    description = models.TextField(blank=True, verbose_name='Description')
    order = models.PositiveIntegerField(default=0, verbose_name='Ordre')
    is_active = models.BooleanField(default=True, verbose_name='Actif')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Chapitre'
        verbose_name_plural = 'Chapitres'
        ordering = ['order', 'title']
        unique_together = ['subject', 'slug']
    
    def __str__(self):
        return f"{self.subject.name} - {self.title}"


class Lesson(models.Model):
    """Leçon d'un chapitre."""
    
    LEVEL_CHOICES = [
        ('cp1', 'CP1'),
        ('cp2', 'CP2'),
        ('ce1', 'CE1'),
        ('ce2', 'CE2'),
        ('cm1', 'CM1'),
        ('cm2', 'CM2'),
        ('sixieme', '6ème'),
        ('cinquieme', '5ème'),
        ('quatrieme', '4ème'),
        ('troisieme', '3ème'),
        ('seconde', 'Seconde'),
        ('premiere', 'Première'),
        ('terminale', 'Terminale'),
    ]
    
    chapter = models.ForeignKey(
        Chapter, 
        on_delete=models.CASCADE, 
        related_name='lessons',
        verbose_name='Chapitre'
    )
    title = models.CharField(max_length=200, verbose_name='Titre')
    slug = models.SlugField()
    content = models.TextField(verbose_name='Contenu')
    summary = models.TextField(blank=True, verbose_name='Résumé')
    level = models.CharField(
        max_length=20, 
        choices=LEVEL_CHOICES,
        verbose_name='Niveau'
    )
    duration_minutes = models.PositiveIntegerField(
        default=30, 
        verbose_name='Durée (minutes)'
    )
    order = models.PositiveIntegerField(default=0, verbose_name='Ordre')
    is_official = models.BooleanField(
        default=True, 
        verbose_name='Programme officiel'
    )
    is_active = models.BooleanField(default=True, verbose_name='Actif')
    image = models.ImageField(
        upload_to='lessons/', 
        blank=True, 
        null=True,
        verbose_name='Image'
    )
    video_url = models.URLField(blank=True, verbose_name='URL Vidéo')
    author = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='created_lessons',
        verbose_name='Auteur'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Leçon'
        verbose_name_plural = 'Leçons'
        ordering = ['order', 'title']
        unique_together = ['chapter', 'slug']
    
    def __str__(self):
        return self.title


class LessonResource(models.Model):
    """Ressource complémentaire pour une leçon."""
    
    RESOURCE_TYPES = [
        ('pdf', 'PDF'),
        ('video', 'Vidéo'),
        ('audio', 'Audio'),
        ('image', 'Image'),
        ('link', 'Lien'),
        ('other', 'Autre'),
    ]
    
    lesson = models.ForeignKey(
        Lesson, 
        on_delete=models.CASCADE, 
        related_name='resources',
        verbose_name='Leçon'
    )
    title = models.CharField(max_length=200, verbose_name='Titre')
    resource_type = models.CharField(
        max_length=20, 
        choices=RESOURCE_TYPES,
        verbose_name='Type'
    )
    file = models.FileField(
        upload_to='lesson_resources/', 
        blank=True, 
        null=True,
        verbose_name='Fichier'
    )
    url = models.URLField(blank=True, verbose_name='URL')
    description = models.TextField(blank=True, verbose_name='Description')
    order = models.PositiveIntegerField(default=0, verbose_name='Ordre')
    
    class Meta:
        verbose_name = 'Ressource'
        verbose_name_plural = 'Ressources'
        ordering = ['order']
    
    def __str__(self):
        return f"{self.lesson.title} - {self.title}"


class LessonView(models.Model):
    """Suivi des vues de leçons par les élèves."""
    
    lesson = models.ForeignKey(
        Lesson, 
        on_delete=models.CASCADE, 
        related_name='views',
        verbose_name='Leçon'
    )
    student = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='lesson_views',
        verbose_name='Élève'
    )
    viewed_at = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False, verbose_name='Terminé')
    completion_percentage = models.PositiveIntegerField(
        default=0, 
        verbose_name='Pourcentage de complétion'
    )
    
    class Meta:
        verbose_name = 'Vue de leçon'
        verbose_name_plural = 'Vues de leçons'
        unique_together = ['lesson', 'student']
    
    def __str__(self):
        return f"{self.student} - {self.lesson}"
