import os
import django
import json

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from exercises.models import Exercise

qcm_exs = Exercise.objects.filter(exercise_type='qcm', is_ai_generated=False)[:2]
print("--- Standard QCMs ---")
for ex in qcm_exs:
    print(ex.id, ex.title)
    print("Content:", json.dumps(ex.content, indent=2, ensure_ascii=False))
    print("Corrects:", ex.correct_answers)

qcm_ai_exs = Exercise.objects.filter(exercise_type='qcm', is_ai_generated=True).order_by('-id')[:2]
print("\n--- AI QCMs ---")
for ex in qcm_ai_exs:
    print(ex.id, ex.title)
    print("Content:", json.dumps(ex.content, indent=2, ensure_ascii=False))
    print("Corrects:", ex.correct_answers)

