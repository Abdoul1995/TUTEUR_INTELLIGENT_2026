import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from ai_tutor.services import AIService
from exercises.models import Subject, Exercise
from django.contrib.auth import get_user_model

User = get_user_model()
u = User.objects.first()

svc = AIService()
print("Generating exercise...")
data = svc.generate_exercise("Mathématiques", "sixieme", "Addition", "medium", "qcm")
print("Generation result keys:", data.keys() if isinstance(data, dict) else data)

sub = Subject.objects.first()
if getattr(data, 'get', None):
    try:
        ex = Exercise.objects.create(
            title=data.get('title', 'test'),
            description=data.get('description', ''),
            subject=sub,
            level='sixieme',
            exercise_type='qcm',
            difficulty='medium',
            content=data.get('content', {}),
            correct_answers=data.get('correct_answers', []),
            explanation=data.get('explanation', ''),
            hints=data.get('hints', []),
            points=int(data.get('points', 10)),
            creator=u,
            is_ai_generated=True
        )
        print("Saved EX:", ex.id)
    except Exception as e:
        print("Error saving:", e)
else:
    print("Data is not a dict:", data)

