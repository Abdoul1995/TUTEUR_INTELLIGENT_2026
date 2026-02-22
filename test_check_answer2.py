import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from exercises.models import Exercise
from exercises.views import ExerciseViewSet

viewset = ExerciseViewSet()

ans = [1, 1, 0]
correct = ['B', 'B', 'A']
is_correct = viewset._check_answer(ans, correct, 'qcm')
print("Is answer [1, 1, 0] correct for AI QCM with ['B', 'B', 'A']?", is_correct)

ans_wrong = [1, 2, 3]
is_correct_wrong = viewset._check_answer(ans_wrong, correct, 'qcm')
print("Is answer [1, 2, 3] correct for AI QCM with ['B', 'B', 'A']?", is_correct_wrong)

