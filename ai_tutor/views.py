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

        import logging
        logger = logging.getLogger(__name__)
        
        try:
            ai_service = AIService()
            response = ai_service.get_chat_response(messages)
            
            if "error" in response:
                logger.error(f"AI Chat Error: {response['error']}")
                return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
            return Response(response)
        except Exception as e:
            logger.exception("Unexpected error in AI Chat")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GenerateExerciseView(APIView):
    permission_classes = [IsAuthenticated]

    # Map any human-readable level name → DB slug code
    LEVEL_MAP = {
        'cp1': 'cp1', 'cp2': 'cp2', 'ce1': 'ce1', 'ce2': 'ce2',
        'cm1': 'cm1', 'cm2': 'cm2',
        '6ème': 'sixieme', '6eme': 'sixieme', 'sixieme': 'sixieme', '6e': 'sixieme',
        '5ème': 'cinquieme', '5eme': 'cinquieme', 'cinquieme': 'cinquieme', '5e': 'cinquieme',
        '4ème': 'quatrieme', '4eme': 'quatrieme', 'quatrieme': 'quatrieme', '4e': 'quatrieme',
        '3ème': 'troisieme', '3eme': 'troisieme', 'troisieme': 'troisieme', '3e': 'troisieme',
        'seconde': 'seconde', '2nde': 'seconde',
        'première': 'premiere', 'premiere': 'premiere', '1ère': 'premiere', '1ere': 'premiere',
        'terminale': 'terminale', 'tle': 'terminale',
    }

    def post(self, request):
        subject_name = request.data.get('subject')
        level_raw = request.data.get('level', '')
        topic = request.data.get('topic')
        difficulty = request.data.get('difficulty', 'medium')
        exercise_type = request.data.get('exercise_type', 'qcm')
        language = request.data.get('language', 'fr')
        
        if not all([subject_name, level_raw, topic]):
            return Response({"error": "Missing required parameters"}, status=status.HTTP_400_BAD_REQUEST)

        # Normalize level to DB code
        level = self.LEVEL_MAP.get(level_raw.lower(), level_raw.lower())

        # Find subject - more robust lookup
        subject = Subject.objects.filter(name__iexact=subject_name).first()
        if not subject:
             subject = Subject.objects.filter(name__icontains=subject_name).first()
        if not subject:
             # Try search by slug
             subject = Subject.objects.filter(slug__iexact=subject_name.lower().replace(' ', '-')).first()
        
        if not subject:
            import logging
            logging.warning(f"Subject '{subject_name}' not found in DB. Available subjects: {list(Subject.objects.values_list('name', flat=True))}")
            return Response({"error": f"Matière '{subject_name}' non trouvée. Vérifiez que la matière est créée dans l'administration."}, status=status.HTTP_404_NOT_FOUND)

        import logging
        logger = logging.getLogger(__name__)

        ai_service = AIService()
        exercise_data = ai_service.generate_exercise(subject.name, level_raw, topic, difficulty, exercise_type, language)

        if "error" in exercise_data:
            logger.error(f"AI Exercise Generation Error: {exercise_data['error']}")
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
            import logging
            logging.info(f"AI Exercise saved with ID {exercise.id} for user {request.user}")
            
            serializer = ExerciseDetailSerializer(exercise, context={'request': request})
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            import logging
            logging.error(f"Error saving AI exercise: {str(e)}", exc_info=True)
            return Response({"error": f"Erreur lors de la sauvegarde de l'exercice : {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
