import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from exercises.models import Exercise
from exercises.views import ExerciseViewSet

# Exercise 52 is an AI QCM
ex = Exercise.objects.get(id=52)

viewset = ExerciseViewSet()
# The right answer is [2, 0, 1] as seen in previous log
ans = [2, 0, 1]

is_correct = viewset._check_answer(ans, ex.correct_answers, 'qcm')
print("Is answer [2, 0, 1] correct for AI QCM?", is_correct)

ans_wrong = [1, 2, 3]
is_correct_wrong = viewset._check_answer(ans_wrong, ex.correct_answers, 'qcm')
print("Is answer [1, 2, 3] correct for AI QCM?", is_correct_wrong)

