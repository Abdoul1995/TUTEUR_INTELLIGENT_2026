from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .services import AIService

class ChatView(APIView):
    permission_classes = [AllowAny] # TODO: Change to IsAuthenticated later if needed

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
    permission_classes = [AllowAny] # Change to IsAuthenticated

    def post(self, request):
        subject = request.data.get('subject')
        level = request.data.get('level')
        topic = request.data.get('topic')
        difficulty = request.data.get('difficulty', 'medium')
        exercise_type = request.data.get('exercise_type', 'qcm')
        
        print(f"DEBUG: GenerateExerciseView - Data: {request.data}")
        print(f"DEBUG: exercise_type_extracted: {exercise_type}")

        if not all([subject, level, topic]):
            return Response({"error": "Missing required parameters"}, status=status.HTTP_400_BAD_REQUEST)

        ai_service = AIService()
        exercise_data = ai_service.generate_exercise(subject, level, topic, difficulty, exercise_type)

        if "error" in exercise_data:
            return Response(exercise_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(exercise_data)
