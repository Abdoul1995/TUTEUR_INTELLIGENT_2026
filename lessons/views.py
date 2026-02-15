"""
Vues pour la gestion des leçons.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import Subject, Chapter, Lesson, LessonView
from .serializers import (
    SubjectSerializer, ChapterListSerializer, ChapterDetailSerializer,
    LessonListSerializer, LessonDetailSerializer, LessonViewSerializer,
    LessonViewUpdateSerializer
)


class SubjectViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour les matières."""
    
    queryset = Subject.objects.filter(is_active=True)
    serializer_class = SubjectSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


class ChapterViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour les chapitres."""
    
    queryset = Chapter.objects.filter(is_active=True)
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ChapterDetailSerializer
        return ChapterListSerializer
    
    def get_queryset(self):
        queryset = Chapter.objects.filter(is_active=True)
        subject = self.request.query_params.get('subject', None)
        if subject:
            queryset = queryset.filter(subject__slug=subject)
        return queryset
    
    @action(detail=True, methods=['get'])
    def lessons(self, request, slug=None):
        """Récupérer les leçons d'un chapitre."""
        chapter = self.get_object()
        lessons = chapter.lessons.filter(is_active=True)
        
        # Filtrer par niveau
        level = request.query_params.get('level', None)
        if level:
            lessons = lessons.filter(level=level)
        
        serializer = LessonListSerializer(lessons, many=True)
        return Response(serializer.data)


class LessonViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour les leçons."""
    
    queryset = Lesson.objects.filter(is_active=True)
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['level', 'chapter', 'chapter__subject']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return LessonDetailSerializer
        return LessonListSerializer
    
    def get_queryset(self):
        queryset = Lesson.objects.filter(is_active=True)
        
        # Filtrer par matière
        subject = self.request.query_params.get('subject', None)
        if subject:
            queryset = queryset.filter(chapter__subject__slug=subject)
        
        # Filtrer par niveau (paramètre URL)
        level_param = self.request.query_params.get('level', None)
        if level_param:
            queryset = queryset.filter(level=level_param)
            
        # Restriction d'accès par niveau de l'élève
        user = self.request.user
        if user.is_authenticated and user.user_type == 'student':
            from users.utils import get_allowed_levels
            allowed_levels = get_allowed_levels(user.level)
            queryset = queryset.filter(level__in=allowed_levels)
        
        # Filtrer par recherche
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(title__icontains=search)
        
        return queryset
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def mark_viewed(self, request, slug=None):
        """Marquer une leçon comme vue."""
        lesson = self.get_object()
        view, created = LessonView.objects.get_or_create(
            lesson=lesson,
            student=request.user
        )
        
        serializer = LessonViewUpdateSerializer(view, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Progression mise à jour',
                'data': LessonViewSerializer(view).data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_lessons(self, request):
        """Récupérer les leçons vues par l'élève connecté."""
        views = LessonView.objects.filter(student=request.user)
        serializer = LessonViewSerializer(views, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_level(self, request):
        """Récupérer les leçons groupées par niveau."""
        levels = {}
        for level_code, level_name in Lesson.LEVEL_CHOICES:
            lessons = Lesson.objects.filter(level=level_code, is_active=True)
            if lessons.exists():
                levels[level_name] = LessonListSerializer(lessons, many=True).data
        return Response(levels)
    
    @action(detail=False, methods=['get'])
    def recommended(self, request):
        """Récupérer les leçons recommandées pour l'élève."""
        if not request.user.is_authenticated or request.user.user_type != 'student':
            # Retourner les leçons les plus récentes
            lessons = Lesson.objects.filter(is_active=True).order_by('-created_at')[:10]
        else:
            # Filtrer par niveau de l'élève
            lessons = Lesson.objects.filter(
                level=request.user.level,
                is_active=True
            ).exclude(
                views__student=request.user,
                views__completed=True
            )[:10]
        
        serializer = LessonListSerializer(lessons, many=True)
        return Response(serializer.data)
