"""
Vues pour la gestion des utilisateurs.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model
from .models import ParentStudentLink
from .serializers import (
    UserSerializer, UserCreateSerializer, UserUpdateSerializer,
    LoginSerializer, ParentStudentLinkSerializer
)

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet pour la gestion des utilisateurs."""
    
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        return UserSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'login']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        """Inscription d'un nouvel utilisateur."""
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Créer un token pour le nouvel utilisateur
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'message': 'Utilisateur créé avec succès',
                'user': UserSerializer(user).data,
                'token': token.key
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        """Connexion d'un utilisateur."""
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            user = authenticate(username=username, password=password)
            
            if user:
                # Créer ou récupérer le token
                token, created = Token.objects.get_or_create(user=user)
                login(request, user)
                return Response({
                    'message': 'Connexion réussie',
                    'user': UserSerializer(user).data,
                    'token': token.key
                })
            return Response({
                'error': 'Nom d\'utilisateur ou mot de passe incorrect'
            }, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def logout(self, request):
        """Déconnexion d'un utilisateur."""
        # Supprimer le token de l'utilisateur
        if request.user.is_authenticated:
            Token.objects.filter(user=request.user).delete()
        logout(request)
        return Response({'message': 'Déconnexion réussie'})
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Récupérer les informations de l'utilisateur connecté."""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def students(self, request):
        """Récupérer la liste des élèves."""
        students = User.objects.filter(user_type='student')
        serializer = UserSerializer(students, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def teachers(self, request):
        """Récupérer la liste des enseignants."""
        teachers = User.objects.filter(user_type='teacher')
        serializer = UserSerializer(teachers, many=True)
        return Response(serializer.data)


class ParentStudentLinkViewSet(viewsets.ModelViewSet):
    """ViewSet pour la gestion des liens parent-élève."""
    
    queryset = ParentStudentLink.objects.all()
    serializer_class = ParentStudentLinkSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'parent':
            return ParentStudentLink.objects.filter(parent=user)
        elif user.user_type == 'student':
            return ParentStudentLink.objects.filter(student=user)
        return ParentStudentLink.objects.all()
