
import os
import django
from django.core.management import call_command
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def clean_and_load():
    print("🧹 Starting database cleanup before import...")
    
    # Tables to clear to avoid conflicts
    # Order matters for foreign keys
    tables_to_clear = [
        'exercises_exerciseattempt',
        'exercises_quizattempt',
        'exercises_exerciseresource',
        'exercises_exercise',
        'exercises_quiz',
        'lessons_lessonview',
        'lessons_lesson',
        'lessons_chapter',
        'lessons_subject',
        'progress_studentprogress',
        'progress_achievement',
        'authtoken_token',
        'users_user',
    ]
    
    with connection.cursor() as cursor:
        for table in tables_to_clear:
            try:
                print(f"  Truncating table {table}...")
                # Use CASCADE for Postgres
                cursor.execute(f'TRUNCATE TABLE "{table}" CASCADE;')
            except Exception as e:
                print(f"  Warning: Could not truncate {table}: {e}")

    print("📥 Loading data from data_export.json...")
    try:
        call_command('loaddata', 'data_export.json')
        print("✅ Data loaded successfully!")
    except Exception as e:
        print(f"❌ Error during loaddata: {e}")
        # Try again with ignore-non-existent just in case
        try:
            call_command('loaddata', 'data_export.json', ignorenonexistent=True)
            print("✅ Data loaded with warnings.")
        except Exception as e2:
            print(f"❌ Fatal error: {e2}")

if __name__ == '__main__':
    clean_and_load()
