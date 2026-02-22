import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from exercises.models import Exercise
from django.contrib.auth import get_user_model

User = get_user_model()
u = User.objects.first()

ex = Exercise.objects.last()
print("Latest ex ID:", ex.id)
print("Latest ex level:", ex.level)
print("Latest ex active:", ex.is_active)
print("Latest ex creator:", ex.creator.username if ex.creator else None)

print("User type:", u.user_type)
print("User level:", getattr(u, 'level', None))

