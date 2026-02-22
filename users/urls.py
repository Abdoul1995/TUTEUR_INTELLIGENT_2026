"""
URLs pour la gestion des utilisateurs.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, ParentStudentLinkViewSet
from .password_reset_views import PasswordResetRequestView, PasswordResetConfirmView

router = DefaultRouter()
router.register(r'', UserViewSet, basename='user')
router.register(r'links', ParentStudentLinkViewSet)

urlpatterns = [
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('', include(router.urls)),
]
