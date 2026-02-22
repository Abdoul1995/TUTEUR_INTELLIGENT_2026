import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from exercises.models import ExerciseAttempt
from django.contrib.auth import get_user_model

User = get_user_model()
u = User.objects.get(username='salgo397')

attempts = ExerciseAttempt.objects.filter(student=u).order_by('-id')[:2]
for att in attempts:
    print("Attempt ID:", att.id)
    print("Exercise ID:", att.exercise.id, "Type:", att.exercise.exercise_type)
    print("Answer submitted:", att.answer, "Type:", type(att.answer))
    print("Correct answers:", att.exercise.correct_answers, "Type:", type(att.exercise.correct_answers))
    print("Evaluated Is Correct:", att.is_correct)
    print("-----")
