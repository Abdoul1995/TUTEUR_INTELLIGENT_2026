import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from users.password_reset_views import PasswordResetRequestView
from rest_framework.test import APIRequestFactory

User = get_user_model()
factory = APIRequestFactory()

def test_reset():
    # Try with an existing email
    user = User.objects.first()
    if not user:
        print("No users found")
        return
    
    email = user.email
    print(f"Testing with email: {email}")
    
    view = PasswordResetRequestView.as_view()
    request = factory.post('/api/users/password-reset/', {'email': email}, format='json')
    
    try:
        response = view(request)
        print(f"Status Code: {response.status_code}")
        print(f"Data: {response.data}")
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_reset()
