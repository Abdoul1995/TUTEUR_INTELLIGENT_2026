import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from exercises.models import Exercise

for ex in Exercise.objects.order_by('-id')[:5]:
    print(ex.id, ex.title, ex.level, getattr(ex, 'is_ai_generated', None), ex.creator)

