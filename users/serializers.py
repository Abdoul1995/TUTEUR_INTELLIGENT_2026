"""
Sérialiseurs pour les utilisateurs.
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import ParentStudentLink

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Sérialiseur pour le modèle User."""
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'user_type', 'level', 'date_of_birth', 'phone', 'avatar',
            'bio', 'is_active_student', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserCreateSerializer(serializers.ModelSerializer):
    """Sérialiseur pour la création d'utilisateur."""
    
    password = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'password', 'first_name', 'last_name',
            'user_type', 'level', 'date_of_birth', 'phone'
        ]
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    """Sérialiseur pour la mise à jour d'utilisateur."""
    
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'email', 'level',
            'date_of_birth', 'phone', 'avatar', 'bio'
        ]


class LoginSerializer(serializers.Serializer):
    """Sérialiseur pour la connexion."""
    
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class ParentStudentLinkSerializer(serializers.ModelSerializer):
    """Sérialiseur pour le lien parent-élève."""
    
    parent_name = serializers.CharField(source='parent.get_full_name', read_only=True)
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    
    class Meta:
        model = ParentStudentLink
        fields = ['id', 'parent', 'student', 'parent_name', 'student_name', 'created_at']
        read_only_fields = ['created_at']
