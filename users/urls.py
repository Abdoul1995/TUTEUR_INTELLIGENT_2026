"""
URLs pour la gestion des utilisateurs.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, ParentStudentLinkViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'links', ParentStudentLinkViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
