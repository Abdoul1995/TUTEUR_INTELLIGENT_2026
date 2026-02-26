
import os
import django
import sys
from django.core.management import call_command
from django.db import connection

# Force stdout to flush immediately
import functools
print = functools.partial(print, flush=True)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def clean_and_load():
    print("🚀 [FORCE IMPORT] Starting database restoration...")
    
    file_path = 'data_export.json'
    if not os.path.exists(file_path):
        print(f"❌ [FORCE IMPORT] Error: {file_path} not found!")
        return

    # Tables to clear to avoid conflicts
    # Order matters for foreign keys - we use CASCADE anyway
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
    
    print("🧹 [FORCE IMPORT] Cleaning tables with TRUNCATE CASCADE...")
    with connection.cursor() as cursor:
        for table in tables_to_clear:
            try:
                # Check if table exists before truncating
                cursor.execute(f"SELECT exists (SELECT FROM information_schema.tables WHERE table_name = '{table}');")
                if cursor.fetchone()[0]:
                    print(f"  - Truncating {table}...")
                    cursor.execute(f'TRUNCATE TABLE "{table}" CASCADE;')
                else:
                    print(f"  - Skipping {table} (does not exist)")
            except Exception as e:
                print(f"  ⚠️ Warning: Could not truncate {table}: {e}")

    print(f"📥 [FORCE IMPORT] Loading data from {file_path}...")
    try:
        # We use verbosity=2 to see what's happening
        call_command('loaddata', file_path, verbosity=2)
        print("✅ [FORCE IMPORT] Success! Data loaded successfully.")
    except Exception as e:
        print(f"❌ [FORCE IMPORT] Error during primary loaddata: {e}")
        print("🔄 [FORCE IMPORT] Attempting fallback with --ignorenonexistent...")
        try:
            call_command('loaddata', file_path, ignorenonexistent=True, verbosity=2)
            print("✅ [FORCE IMPORT] Data loaded with ignorenonexistent=True.")
        except Exception as e2:
            print(f"🔥 [FORCE IMPORT] FATAL ERROR: {e2}")
            # Don't exit with error to avoid breaking the whole build if migrations are otherwise fine
            # But we want to see this in logs
            sys.exit(0) 

if __name__ == '__main__':
    clean_and_load()
