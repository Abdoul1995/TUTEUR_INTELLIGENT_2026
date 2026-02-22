import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.test.client import Client
from django.contrib.auth import get_user_model
User = get_user_model()
u = User.objects.get(username='salgo397')

c = Client()
c.force_login(u)

res = c.get('/api/exercises/exercises/52/')
print("Status Code:", res.status_code)
if res.status_code != 200:
    print("Content:", res.content)

