"""
Sérialiseurs pour les exercices.
"""
from rest_framework import serializers
from .models import Exercise, ExerciseAttempt, Quiz, QuizAttempt


class ExerciseListSerializer(serializers.ModelSerializer):
    """Sérialiseur liste pour les exercices."""
    
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)
    difficulty_display = serializers.CharField(source='get_difficulty_display', read_only=True)
    type_display = serializers.CharField(source='get_exercise_type_display', read_only=True)
    
    class Meta:
        model = Exercise
        fields = [
            'id', 'title', 'description', 'exercise_type', 'type_display',
            'difficulty', 'difficulty_display', 'level', 'subject', 'subject_name',
            'lesson', 'lesson_title', 'points', 'time_limit', 'order',
            'creator', 'is_ai_generated'
        ]



class ExerciseCreateSerializer(serializers.ModelSerializer):
    """Sérialiseur pour la création d'exercices."""
    
    class Meta:
        model = Exercise
        fields = [
            'id', 'title', 'description', 'exercise_type',
            'difficulty', 'level', 'subject', 'lesson',
            'content', 'correct_answers', 'explanation', 'hints',
            'points', 'time_limit', 'order', 'is_active',
            'creator', 'is_ai_generated'
        ]


class ExerciseDetailSerializer(serializers.ModelSerializer):
    """Sérialiseur détail pour les exercices."""
    
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)
    difficulty_display = serializers.CharField(source='get_difficulty_display', read_only=True)
    type_display = serializers.CharField(source='get_exercise_type_display', read_only=True)
    attempts_count = serializers.SerializerMethodField()
    best_score = serializers.SerializerMethodField()
    
    class Meta:
        model = Exercise
        fields = [
            'id', 'title', 'description', 'exercise_type', 'type_display',
            'difficulty', 'difficulty_display', 'level', 'subject', 'subject_name',
            'lesson', 'lesson_title', 'content', 'hints', 'explanation',
            'points', 'time_limit', 'attempts_count', 'best_score',
            'creator', 'is_ai_generated'
        ]

    def to_representation(self, instance):
        """Include correct_answers only for classic exercises."""
        ret = super().to_representation(instance)
        if instance.exercise_type == 'classic':
            ret['correct_answers'] = instance.correct_answers
        return ret
    
    def get_attempts_count(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.attempts.filter(student=request.user).count()
        return 0
    
    def get_best_score(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            best = obj.attempts.filter(student=request.user).order_by('-score').first()
            return best.score if best else 0


class ExerciseAnswerSerializer(serializers.Serializer):
    """Sérialiseur pour la réponse à un exercice."""
    
    answer = serializers.JSONField()
    time_spent = serializers.IntegerField(default=0)
    hints_used = serializers.IntegerField(default=0)


class ExerciseResultSerializer(serializers.Serializer):
    """Sérialiseur pour le résultat d'un exercice."""
    
    is_correct = serializers.BooleanField()
    score = serializers.IntegerField()
    correct_answer = serializers.JSONField()
    explanation = serializers.CharField()
    message = serializers.CharField()


class ExerciseAttemptSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les tentatives d'exercice."""
    
    exercise_title = serializers.CharField(source='exercise.title', read_only=True)
    
    class Meta:
        model = ExerciseAttempt
        fields = [
            'id', 'exercise', 'exercise_title', 'answer', 'is_correct',
            'score', 'time_spent', 'hints_used', 'attempt_number', 'created_at'
        ]


class QuizExerciseSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les exercices dans un quiz (inclut le contenu sans les réponses)."""
    
    type_display = serializers.CharField(source='get_exercise_type_display', read_only=True)
    
    class Meta:
        model = Exercise
        fields = [
            'id', 'title', 'description', 'exercise_type', 'type_display',
            'difficulty', 'points', 'content', 'time_limit' # Added content
        ]


class QuizListSerializer(serializers.ModelSerializer):
    """Sérialiseur liste pour les quiz."""
    
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)
    exercise_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Quiz
        fields = [
            'id', 'title', 'description', 'subject', 'subject_name',
            'lesson', 'lesson_title', 'level', 'time_limit',
            'passing_score', 'exercise_count'
        ]
    
    def get_exercise_count(self, obj):
        return obj.exercises.count()


class QuizDetailSerializer(serializers.ModelSerializer):
    """Sérialiseur détail pour les quiz."""
    
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)
    exercises = QuizExerciseSerializer(many=True, read_only=True) # Used new serializer
    
    class Meta:
        model = Quiz
        fields = [
            'id', 'title', 'description', 'subject', 'subject_name',
            'lesson', 'lesson_title', 'level', 'time_limit',
            'passing_score', 'exercises'
        ]


class QuizAttemptSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les tentatives de quiz."""
    
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    
    class Meta:
        model = QuizAttempt
        fields = [
            'id', 'quiz', 'quiz_title', 'score', 'total_score',
            'percentage', 'is_passed', 'time_spent', 'completed',
            'started_at', 'completed_at'
        ]
