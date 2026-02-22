import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from exercises.models import Exercise
from django.contrib.auth import get_user_model

User = get_user_model()
try:
    ex = Exercise.objects.get(id=52)
    print("Found Exercise:")
    print("ID:", ex.id)
    print("Title:", ex.title)
    print("Level:", ex.level)
    print("Creator:", ex.creator.username if ex.creator else None)
    print("Is Active:", ex.is_active)
    
    # Try filtering simulation
    user = User.objects.get(username='salgo397')  # Assuming salgo397 is the user based on previous logs? 
    # Let's get the creator of ex 52
    user = ex.creator
    print("\nSimulating user access for creator:", user.username)
    print("User role:", user.user_type)
    
    from users.utils import get_allowed_levels
    allowed_levels = get_allowed_levels(user.level)
    print("User permitted levels:", allowed_levels)
    
    from django.db import models
    qs = Exercise.objects.filter(is_active=True).filter(
        models.Q(level__in=allowed_levels) | 
        models.Q(creator=user)
    )
    if not user.is_superuser and user.user_type != 'admin':
        qs = qs.filter(
            models.Q(creator__user_type='admin') | 
            models.Q(creator=user)
        )
        
    print("Is ex 52 in filtered qs?", qs.filter(id=52).exists())

except Exception as e:
    print("Error:", e)
