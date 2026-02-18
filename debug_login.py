import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from rest_framework.test import APIRequestFactory
from users.views import UserViewSet
from django.contrib.auth import get_user_model

def test_login():
    print("Testing login API...")
    view = UserViewSet.as_view({'post': 'login'})
    factory = APIRequestFactory()
    
    # Try with dummy data
    request = factory.post('/api/users/users/login/', {'username': 'testuser', 'password': 'password123'}, format='json')
    
    try:
        response = view(request)
        print(f"Status Code: {response.status_code}")
        print(f"Data: {response.data}")
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_login()
