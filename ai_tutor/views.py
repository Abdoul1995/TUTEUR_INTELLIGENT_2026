from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .services import AIService
from exercises.models import Exercise, Subject
from exercises.serializers import ExerciseDetailSerializer

class ChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        messages = request.data.get('messages', [])
        if not messages:
            return Response({"error": "No messages provided"}, status=status.HTTP_400_BAD_REQUEST)

        ai_service = AIService()
        response = ai_service.get_chat_response(messages)
        
        if "error" in response:
            return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        return Response(response)

class GenerateExerciseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        subject_name = request.data.get('subject')
        level = request.data.get('level')
        topic = request.data.get('topic')
        difficulty = request.data.get('difficulty', 'medium')
        exercise_type = request.data.get('exercise_type', 'qcm')
        
        if not all([subject_name, level, topic]):
            return Response({"error": "Missing required parameters"}, status=status.HTTP_400_BAD_REQUEST)

        # Find subject - more robust lookup
        subject = Subject.objects.filter(name__iexact=subject_name).first()
        if not subject:
             subject = Subject.objects.filter(name__icontains=subject_name).first()
        if not subject:
             # Try search by slug
             subject = Subject.objects.filter(slug__iexact=subject_name.lower().replace(' ', '-')).first()
        
        if not subject:
            print(f"DEBUG: Subject '{subject_name}' not found in DB")
            return Response({"error": f"Matière '{subject_name}' non trouvée dans la base de données."}, status=status.HTTP_404_NOT_FOUND)

        ai_service = AIService()
        exercise_data = ai_service.generate_exercise(subject.name, level, topic, difficulty, exercise_type)

        if "error" in exercise_data:
            return Response(exercise_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            # Save the exercise to the database
            exercise = Exercise.objects.create(
                title=exercise_data.get('title', f"Exercice de {subject.name}"),
                description=exercise_data.get('description', ''),
                subject=subject,
                level=level,
                exercise_type=exercise_type,
                difficulty=difficulty,
                content=exercise_data.get('content', {}),
                correct_answers=exercise_data.get('correct_answers', []),
                explanation=exercise_data.get('explanation', ''),
                hints=exercise_data.get('hints', []),
                points=int(exercise_data.get('points', 10)),
                creator=request.user,
                is_ai_generated=True
            )
            print(f"DEBUG: Exercise saved with ID {exercise.id}")
            
            serializer = ExerciseDetailSerializer(exercise, context={'request': request})
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"DEBUG: Error saving exercise: {str(e)}")
            return Response({"error": f"Erreur lors de la sauvegarde de l'exercice : {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
