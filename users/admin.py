"""
Admin pour les utilisateurs.
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, ParentStudentLink


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """Admin pour le modèle User personnalisé."""
    
    list_display = [
        'username', 'first_name', 'last_name', 'email',
        'user_type', 'level', 'is_active_student', 'is_staff'
    ]
    list_filter = ['user_type', 'level', 'is_active_student', 'is_staff', 'is_superuser']
    search_fields = ['username', 'first_name', 'last_name', 'email']
    
    fieldsets = UserAdmin.fieldsets + (
        ('Informations supplémentaires', {
            'fields': ('user_type', 'level', 'date_of_birth', 'phone', 'avatar', 'bio', 'is_active_student')
        }),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Informations supplémentaires', {
            'fields': ('user_type', 'level', 'first_name', 'last_name')
        }),
    )


@admin.register(ParentStudentLink)
class ParentStudentLinkAdmin(admin.ModelAdmin):
    """Admin pour le lien parent-élève."""
    
    list_display = ['parent', 'student', 'created_at']
    list_filter = ['created_at']
    search_fields = ['parent__username', 'student__username']
