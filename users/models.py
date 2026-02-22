"""
Modèles pour la gestion des utilisateurs.
"""
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Modèle utilisateur personnalisé pour le tuteur intelligent."""
    
    USER_TYPE_CHOICES = [
        ('student', 'Élève'),
        ('teacher', 'Enseignant'),
        ('parent', 'Parent'),
        ('admin', 'Administrateur'),
    ]
    
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
    
    user_type = models.CharField(
        max_length=20, 
        choices=USER_TYPE_CHOICES, 
        default='student',
        verbose_name='Type d\'utilisateur'
    )
    level = models.CharField(
        max_length=20, 
        choices=LEVEL_CHOICES, 
        blank=True, 
        null=True,
        verbose_name='Niveau scolaire'
    )
    date_of_birth = models.DateField(
        blank=True, 
        null=True,
        verbose_name='Date de naissance'
    )
    phone = models.CharField(
        max_length=20, 
        blank=True,
        verbose_name='Téléphone'
    )
    avatar = models.ImageField(
        upload_to='avatars/', 
        blank=True, 
        null=True,
        verbose_name='Photo de profil'
    )
    subject = models.CharField(
        max_length=100,
        blank=True,
        verbose_name='Matière enseignée'
    )
    bio = models.TextField(
        blank=True,
        verbose_name='Biographie'
    )
    is_active_student = models.BooleanField(
        default=True,
        verbose_name='Élève actif'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Utilisateur'
        verbose_name_plural = 'Utilisateurs'
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.username})"


class ParentStudentLink(models.Model):
    """Lien entre parent et élève."""
    
    parent = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='children',
        limit_choices_to={'user_type': 'parent'}
    )
    student = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='parents',
        limit_choices_to={'user_type': 'student'}
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['parent', 'student']
        verbose_name = 'Lien Parent-Élève'
        verbose_name_plural = 'Liens Parents-Élèves'
    
    def __str__(self):
        return f"{self.parent} - {self.student}"
