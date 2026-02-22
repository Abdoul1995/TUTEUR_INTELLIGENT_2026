import os
import django
import sys

# Setup Django
sys.path.append('/home/salgo/Documents/codes/web_project/web_project1/tuteur-intelligent')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.conf import settings
from pathlib import Path

# Override to use SQLite for checking
settings.DATABASES['default'] = {
    'ENGINE': 'django.db.backends.sqlite3',
    'NAME': Path('/home/salgo/Documents/codes/web_project/web_project1/tuteur-intelligent/db.sqlite3'),
}

from lessons.models import Lesson, LessonResource

lessons = Lesson.objects.all()
print(f"Total lessons: {lessons.count()}")
for l in lessons:
    print(f"Lesson: {l.title}")
    print(f"  PDF (model): {l.pdf_content}")
    print(f"  Video: {l.video_url}")

resources = LessonResource.objects.all()
print(f"\nTotal resources: {resources.count()}")
for r in resources:
    print(f"Resource: {r.title} (Lesson: {r.lesson.title})")
    print(f"  Type: {r.resource_type}")
    print(f"  File: {r.file}")
    print(f"  URL: {r.url}")
    if r.file:
        path = r.file.path if hasattr(r.file, 'path') else 'No path'
        exists = os.path.exists(path) if hasattr(r.file, 'path') else False
        print(f"  File exists: {exists}")
        print(f"  Full path: {path}")
