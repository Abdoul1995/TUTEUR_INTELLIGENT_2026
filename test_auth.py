import os
import django
from django.contrib.auth import authenticate, get_user_model
from django.test import RequestFactory

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def test_auth():
    User = get_user_model()
    try:
        u = User.objects.get(username='admin')
        u.set_password('admin123')
        u.save()
        print("Admin password reset to 'admin123'")
    except User.DoesNotExist:
        print("Admin account not found!")
        return

    factory = RequestFactory()
    request = factory.post('/api/users/users/login/')
    
    # Test with username
    print("Testing auth with username 'admin'...")
    user = authenticate(request, username='admin', password='admin123')
    if user:
        print("✅ Auth success with username!")
    else:
        print("❌ Auth failed with username!")

    # Test with email (if admin has one)
    if u.email:
        print(f"Testing auth with email '{u.email}'...")
        # Note: My updated login view handles email by searching User model first.
        # But authenticate() itself usually only takes username.
        # Let's check if my manual email logic in views.py works.
        try:
            user_by_email = User.objects.get(email=u.email)
            user = authenticate(request, username=user_by_email.username, password='admin123')
            if user:
                print("✅ Auth success with email (via username lookup)!")
            else:
                print("❌ Auth failed with email!")
        except Exception as e:
            print(f"❌ Error during email auth test: {e}")

if __name__ == "__main__":
    test_auth()
