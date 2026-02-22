import os
import django
import json

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from exercises.models import Exercise

classic_ai_exs = Exercise.objects.filter(exercise_type='classic', is_ai_generated=True).order_by('-id')[:3]
print("\n--- AI Classic ---")
for ex in classic_ai_exs:
    print(ex.id, ex.title)
    print("Content:", json.dumps(ex.content, indent=2, ensure_ascii=False))
    print("Corrects:", ex.correct_answers)

