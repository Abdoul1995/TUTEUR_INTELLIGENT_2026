"""
Vues pour la gestion des exercices.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from .models import Exercise, ExerciseAttempt, Quiz, QuizAttempt
from .serializers import (
    ExerciseListSerializer, ExerciseDetailSerializer, ExerciseCreateSerializer, ExerciseAnswerSerializer,
    ExerciseResultSerializer, ExerciseAttemptSerializer,
    QuizListSerializer, QuizDetailSerializer, QuizAttemptSerializer
)


class ExerciseViewSet(viewsets.ModelViewSet):
    """ViewSet pour les exercices."""
    
    queryset = Exercise.objects.filter(is_active=True)
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return [AllowAny()]
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ExerciseCreateSerializer
        if self.action == 'retrieve':
            return ExerciseDetailSerializer
        return ExerciseListSerializer
    
    def get_queryset(self):
        queryset = Exercise.objects.filter(is_active=True)
        
        # Filtrer par matière
        subject = self.request.query_params.get('subject', None)
        if subject:
            queryset = queryset.filter(subject__slug=subject)
        
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
        
        # Filtrer par difficulté
        difficulty = self.request.query_params.get('difficulty', None)
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)
        
        # Filtrer par leçon
        lesson = self.request.query_params.get('lesson', None)
        if lesson:
            queryset = queryset.filter(lesson__slug=lesson)
        
        return queryset
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def submit(self, request, pk=None):
        """Soumettre une réponse à un exercice."""
        exercise = self.get_object()
        serializer = ExerciseAnswerSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        answer = serializer.validated_data['answer']
        time_spent = serializer.validated_data.get('time_spent', 0)
        hints_used = serializer.validated_data.get('hints_used', 0)
        
        # Vérifier la réponse
        correct_answers = exercise.correct_answers
        is_correct = self._check_answer(answer, correct_answers, exercise.exercise_type)
        
        # Calculer le score
        score = exercise.points if is_correct else 0
        if hints_used > 0:
            score = max(0, score - (hints_used * 2))  # Pénalité pour indices
        
        # Créer la tentative
        attempt = ExerciseAttempt.objects.create(
            exercise=exercise,
            student=request.user,
            answer=answer,
            is_correct=is_correct,
            score=score,
            time_spent=time_spent,
            hints_used=hints_used
        )
        
        result = {
            'is_correct': is_correct,
            'score': score,
            'correct_answer': correct_answers,
            'explanation': exercise.explanation,
            'message': 'Bravo !' if is_correct else 'Ce n\'est pas la bonne réponse. Réessayez !'
        }
        
        return Response(result)
    
    def _check_answer(self, answer, correct_answers, exercise_type):
        """Vérifier si la réponse est correcte selon le type d'exercice."""
        if exercise_type == 'qcm':
            return answer == correct_answers
        elif exercise_type == 'text':
            return answer.lower().strip() == correct_answers.lower().strip()
        elif exercise_type == 'number':
            try:
                return float(answer) == float(correct_answers)
            except (ValueError, TypeError):
                return False
        elif exercise_type == 'matching':
            return answer == correct_answers
        elif exercise_type == 'fill_blank':
            return answer == correct_answers
        elif exercise_type == 'ordering':
            return answer == correct_answers
        return False
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_attempts(self, request):
        """Récupérer les tentatives de l'élève connecté."""
        attempts = ExerciseAttempt.objects.filter(student=request.user)
        serializer = ExerciseAttemptSerializer(attempts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_lesson(self, request):
        """Récupérer les exercices groupés par leçon."""
        from lessons.models import Lesson
        
        lessons = {}
        for lesson in Lesson.objects.filter(is_active=True):
            exercises = Exercise.objects.filter(lesson=lesson, is_active=True)
            if exercises.exists():
                lessons[lesson.title] = ExerciseListSerializer(exercises, many=True).data
        return Response(lessons)


class QuizViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour les quiz."""
    
    queryset = Quiz.objects.filter(is_active=True)
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return QuizDetailSerializer
        return QuizListSerializer
    
    def get_queryset(self):
        queryset = Quiz.objects.filter(is_active=True)
        
        subject = self.request.query_params.get('subject', None)
        if subject:
            queryset = queryset.filter(subject__slug=subject)
        
        level_param = self.request.query_params.get('level', None)
        if level_param:
            queryset = queryset.filter(level=level_param)
            
        # Restriction d'accès par niveau de l'élève
        user = self.request.user
        if user.is_authenticated and user.user_type == 'student':
            from users.utils import get_allowed_levels
            allowed_levels = get_allowed_levels(user.level)
            queryset = queryset.filter(level__in=allowed_levels)
        
        return queryset
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def start(self, request, pk=None):
        """Démarrer un quiz."""
        quiz = self.get_object()
        
        # Créer une nouvelle tentative
        attempt = QuizAttempt.objects.create(
            quiz=quiz,
            student=request.user
        )
        
        return Response({
            'message': 'Quiz démarré',
            'attempt_id': attempt.id,
            'quiz': QuizDetailSerializer(quiz).data
        })
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def submit(self, request, pk=None):
        """Soumettre les réponses d'un quiz."""
        quiz = self.get_object()
        attempt_id = request.data.get('attempt_id')
        answers = request.data.get('answers', {})
        
        try:
            attempt = QuizAttempt.objects.get(
                id=attempt_id,
                quiz=quiz,
                student=request.user
            )
        except QuizAttempt.DoesNotExist:
            return Response(
                {'error': 'Tentative non trouvée'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Calculer le score
        total_score = 0
        score = 0
        
        for exercise in quiz.exercises.all():
            total_score += exercise.points
            answer = answers.get(str(exercise.id))
            if answer:
                correct_answers = exercise.correct_answers
                is_correct = self._check_answer(answer, correct_answers, exercise.exercise_type)
                if is_correct:
                    score += exercise.points
        
        # Mettre à jour la tentative
        attempt.score = score
        attempt.total_score = total_score
        attempt.percentage = int((score / total_score) * 100) if total_score > 0 else 0
        attempt.is_passed = attempt.percentage >= quiz.passing_score
        attempt.completed = True
        attempt.completed_at = timezone.now()
        attempt.save()
        
        return Response({
            'message': 'Quiz terminé',
            'score': score,
            'total_score': total_score,
            'percentage': attempt.percentage,
            'is_passed': attempt.is_passed
        })
    
    def _check_answer(self, answer, correct_answers, exercise_type):
        """Vérifier si la réponse est correcte."""
        if exercise_type == 'qcm':
            return answer == correct_answers
        elif exercise_type == 'text':
            return answer.lower().strip() == correct_answers.lower().strip()
        elif exercise_type == 'number':
            try:
                return float(answer) == float(correct_answers)
            except (ValueError, TypeError):
                return False
        elif exercise_type in ['matching', 'fill_blank', 'ordering']:
            return answer == correct_answers
        return False
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_attempts(self, request):
        """Récupérer les tentatives de quiz de l'élève."""
        attempts = QuizAttempt.objects.filter(student=request.user)
        serializer = QuizAttemptSerializer(attempts, many=True)
        return Response(serializer.data)
