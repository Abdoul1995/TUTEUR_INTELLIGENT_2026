import os
import django
import sys

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
sys.path.append("/home/salgo/Documents/codes/web_project/web_project1/tuteur-intelligent/")
django.setup()

from lessons.models import Subject
print("Total Subjects: ", Subject.objects.count())
print("Active Subjects: ", Subject.objects.filter(is_active=True).count())
for s in Subject.objects.filter(is_active=True):
    print(s.id, s.name, s.slug)
