import os
import django
import sys

# Setup Django environment
sys.path.append('/home/salgo/Documents/codes/web_project/web_project1/tuteur-intelligent')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from exercises.models import Exercise, Quiz

def migrate_exercises():
    # Find all exercises that are NOT 'classic' type
    exercises_to_migrate = Exercise.objects.exclude(exercise_type='classic')
    
    print(f"Found {exercises_to_migrate.count()} exercises to migrate to Quizzes.")
    
    migrated_count = 0
    for exercise in exercises_to_migrate:
        # Check if this exercise is already part of a quiz with the same title
        # This is a basic check to avoid duplicates if script is run multiple times
        existing_quiz = Quiz.objects.filter(
            title=exercise.title, 
            exercises=exercise
        ).exists()
        
        if existing_quiz:
            print(f"Skipping {exercise.title}: Already in a quiz.")
            continue
            
        print(f"Migrating: {exercise.title} ({exercise.get_exercise_type_display()})")
        
        # Create a new Quiz for this exercise
        quiz = Quiz.objects.create(
            title=exercise.title,
            description=exercise.description or f"Quiz généré à partir de l'exercice: {exercise.title}",
            subject=exercise.subject,
            lesson=exercise.lesson,
            level=exercise.level,
            passing_score=50, # Default
            is_active=True
        )
        
        # Add the exercise to the quiz
        quiz.exercises.add(exercise)
        migrated_count += 1
        
    print(f"Migration completed. {migrated_count} new Quizzes created.")

if __name__ == "__main__":
    migrate_exercises()
