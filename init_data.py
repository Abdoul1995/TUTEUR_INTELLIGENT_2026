#!/usr/bin/env python
"""
Script d'initialisation des données de démonstration pour Tuteur Intelligent.
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User
from lessons.models import Subject, Chapter, Lesson
from exercises.models import Exercise
from progress.models import Achievement


def create_subjects():
    """Créer les matières de base."""
    subjects_data = [
        {
            'name': 'Mathématiques',
            'slug': 'mathematiques',
            'description': 'Apprenez les mathématiques de manière interactive',
            'color': '#3B82F6',
            'icon': 'calculator'
        },
        {
            'name': 'Français',
            'slug': 'francais',
            'description': 'Maîtrisez la langue française',
            'color': '#EF4444',
            'icon': 'book'
        },
        {
            'name': 'Sciences',
            'slug': 'sciences',
            'description': 'Découvrez les sciences naturelles',
            'color': '#10B981',
            'icon': 'flask'
        },
        {
            'name': 'Histoire-Géographie',
            'slug': 'histoire-geographie',
            'description': 'Explorez le monde et son histoire',
            'color': '#F59E0B',
            'icon': 'globe'
        },
        {
            'name': 'Anglais',
            'slug': 'anglais',
            'description': 'Apprenez l\'anglais facilement',
            'color': '#8B5CF6',
            'icon': 'message-circle'
        },
    ]
    
    subjects = []
    for data in subjects_data:
        subject, created = Subject.objects.get_or_create(
            slug=data['slug'],
            defaults=data
        )
        subjects.append(subject)
        if created:
            print(f"✓ Matière créée : {subject.name}")
        else:
            print(f"✓ Matière existante : {subject.name}")
    
    return subjects


def create_chapters(subjects):
    """Créer des chapitres pour chaque matière."""
    chapters_data = {
        'mathematiques': [
            {'title': 'Nombres et calculs', 'slug': 'nombres-calculs'},
            {'title': 'Géométrie', 'slug': 'geometrie'},
            {'title': 'Mesures', 'slug': 'mesures'},
            {'title': 'Proportionnalité', 'slug': 'proportionnalite'},
        ],
        'francais': [
            {'title': 'Grammaire', 'slug': 'grammaire'},
            {'title': 'Conjugaison', 'slug': 'conjugaison'},
            {'title': 'Orthographe', 'slug': 'orthographe'},
            {'title': 'Vocabulaire', 'slug': 'vocabulaire'},
        ],
        'sciences': [
            {'title': 'La matière', 'slug': 'la-matiere'},
            {'title': 'Les vivants', 'slug': 'les-vivants'},
            {'title': 'L\'Univers', 'slug': 'l-univers'},
            {'title': 'L\'énergie', 'slug': 'l-energie'},
        ],
    }
    
    chapters = []
    for subject in subjects:
        if subject.slug in chapters_data:
            for i, chapter_data in enumerate(chapters_data[subject.slug]):
                chapter, created = Chapter.objects.get_or_create(
                    subject=subject,
                    slug=chapter_data['slug'],
                    defaults={
                        'title': chapter_data['title'],
                        'order': i,
                        'is_active': True
                    }
                )
                chapters.append(chapter)
                if created:
                    print(f"✓ Chapitre créé : {chapter.title} ({subject.name})")
    
    return chapters


def create_lessons(chapters):
    """Créer des leçons pour chaque chapitre."""
    lessons_data = {
        'nombres-calculs': [
            {
                'title': 'Les nombres entiers',
                'slug': 'nombres-entiers',
                'content': '<h2>Les nombres entiers</h2><p>Les nombres entiers sont...</p>',
                'summary': 'Apprenez à manipuler les nombres entiers',
                'level': 'cm1',
                'duration_minutes': 20
            },
            {
                'title': 'Les fractions',
                'slug': 'fractions',
                'content': '<h2>Les fractions</h2><p>Une fraction représente...</p>',
                'summary': 'Comprendre et utiliser les fractions',
                'level': 'cm2',
                'duration_minutes': 25
            },
        ],
        'geometrie': [
            {
                'title': 'Les figures planes',
                'slug': 'figures-planes',
                'content': '<h2>Les figures planes</h2><p>Les figures planes sont...</p>',
                'summary': 'Découvrez les différentes figures géométriques',
                'level': 'ce2',
                'duration_minutes': 15
            },
        ],
        'grammaire': [
            {
                'title': 'Le sujet et le verbe',
                'slug': 'sujet-verbe',
                'content': '<h2>Le sujet et le verbe</h2><p>Dans une phrase...</p>',
                'summary': 'Identifiez le sujet et le verbe dans une phrase',
                'level': 'ce1',
                'duration_minutes': 15
            },
        ],
    }
    
    lessons = []
    for chapter in chapters:
        if chapter.slug in lessons_data:
            for i, lesson_data in enumerate(lessons_data[chapter.slug]):
                lesson, created = Lesson.objects.get_or_create(
                    chapter=chapter,
                    slug=lesson_data['slug'],
                    defaults={
                        'title': lesson_data['title'],
                        'content': lesson_data['content'],
                        'summary': lesson_data['summary'],
                        'level': lesson_data['level'],
                        'duration_minutes': lesson_data['duration_minutes'],
                        'order': i,
                        'is_active': True
                    }
                )
                lessons.append(lesson)
                if created:
                    print(f"✓ Leçon créée : {lesson.title}")
    
    return lessons


def create_exercises(subjects):
    """Créer des exercices pour chaque matière."""
    exercises_data = [
        {
            'subject_slug': 'mathematiques',
            'title': 'Addition de nombres entiers',
            'description': 'Calculez les additions suivantes',
            'exercise_type': 'qcm',
            'difficulty': 'easy',
            'level': 'ce1',
            'content': {
                'question': 'Combien font 15 + 27 ?',
                'options': ['42', '32', '52', '40']
            },
            'correct_answers': 0,
            'explanation': '15 + 27 = 42. On additionne les unités (5+7=12) et les dizaines (1+2+1=4).',
            'points': 10
        },
        {
            'subject_slug': 'mathematiques',
            'title': 'Multiplication',
            'description': 'Calculez les multiplications',
            'exercise_type': 'qcm',
            'difficulty': 'medium',
            'level': 'cm1',
            'content': {
                'question': 'Combien font 12 × 8 ?',
                'options': ['96', '86', '106', '76']
            },
            'correct_answers': 0,
            'explanation': '12 × 8 = 96. On peut calculer (10 × 8) + (2 × 8) = 80 + 16 = 96.',
            'points': 15
        },
        {
            'subject_slug': 'francais',
            'title': 'Le pluriel des noms',
            'description': 'Mettez ces noms au pluriel',
            'exercise_type': 'text',
            'difficulty': 'easy',
            'level': 'ce1',
            'content': {
                'question': 'Mettez "cheval" au pluriel'
            },
            'correct_answers': 'chevaux',
            'explanation': 'Les noms en -al forment leur pluriel en -aux.',
            'points': 10
        },
    ]
    
    exercises = []
    for data in exercises_data:
        try:
            subject = Subject.objects.get(slug=data['subject_slug'])
            exercise, created = Exercise.objects.get_or_create(
                subject=subject,
                title=data['title'],
                defaults={
                    'description': data['description'],
                    'exercise_type': data['exercise_type'],
                    'difficulty': data['difficulty'],
                    'level': data['level'],
                    'content': data['content'],
                    'correct_answers': data['correct_answers'],
                    'explanation': data['explanation'],
                    'points': data['points'],
                    'is_active': True
                }
            )
            exercises.append(exercise)
            if created:
                print(f"✓ Exercice créé : {exercise.title}")
        except Subject.DoesNotExist:
            print(f"✗ Matière non trouvée : {data['subject_slug']}")
    
    return exercises


def create_achievements():
    """Créer les badges de réussite."""
    achievements_data = [
        {
            'name': 'Première leçon',
            'description': 'Terminez votre première leçon',
            'achievement_type': 'lessons',
            'icon': 'book-open',
            'color': '#3B82F6',
            'requirement': 1
        },
        {
            'name': 'Apprenti',
            'description': 'Terminez 10 leçons',
            'achievement_type': 'lessons',
            'icon': 'graduation-cap',
            'color': '#10B981',
            'requirement': 10
        },
        {
            'name': 'Premier exercice',
            'description': 'Réussissez votre premier exercice',
            'achievement_type': 'exercises',
            'icon': 'check-circle',
            'color': '#F59E0B',
            'requirement': 1
        },
        {
            'name': 'Série de 3 jours',
            'description': 'Connectez-vous 3 jours de suite',
            'achievement_type': 'streak',
            'icon': 'flame',
            'color': '#EF4444',
            'requirement': 3
        },
        {
            'name': 'Expert',
            'description': 'Obtenez 1000 points',
            'achievement_type': 'score',
            'icon': 'star',
            'color': '#8B5CF6',
            'requirement': 1000
        },
    ]
    
    achievements = []
    for data in achievements_data:
        achievement, created = Achievement.objects.get_or_create(
            name=data['name'],
            defaults=data
        )
        achievements.append(achievement)
        if created:
            print(f"✓ Badge créé : {achievement.name}")
    
    return achievements


def main():
    """Fonction principale d'initialisation."""
    print("=" * 60)
    print("Initialisation des données de Tuteur Intelligent")
    print("=" * 60)
    print()
    
    print("1. Création des matières...")
    subjects = create_subjects()
    print()
    
    print("2. Création des chapitres...")
    chapters = create_chapters(subjects)
    print()
    
    print("3. Création des leçons...")
    lessons = create_lessons(chapters)
    print()
    
    print("4. Création des exercices...")
    exercises = create_exercises(subjects)
    print()
    
    print("5. Création des badges...")
    achievements = create_achievements()
    print()
    
    print("=" * 60)
    print("Initialisation terminée avec succès!")
    print("=" * 60)
    print()
    print(f"📚 {len(subjects)} matières créées")
    print(f"📖 {len(chapters)} chapitres créés")
    print(f"📄 {len(lessons)} leçons créées")
    print(f"✏️  {len(exercises)} exercices créés")
    print(f"🏆 {len(achievements)} badges créés")
    print()
    print("Vous pouvez maintenant démarrer l'application!")


if __name__ == '__main__':
    main()
