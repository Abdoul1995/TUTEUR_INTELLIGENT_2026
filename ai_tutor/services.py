import os
import json
from openai import OpenAI
from django.conf import settings

class AIService:
    def __init__(self):
        self.api_key = os.getenv('GROQ_API_KEY')
        self.client = None
        if self.api_key:
            self.client = OpenAI(
                base_url="https://api.groq.com/openai/v1",
                api_key=self.api_key
            )

    def get_chat_response(self, messages):
        """
        Get a response from the AI tutor.
        messages: list of dictionary with 'role' and 'content'.
        """
        if not self.client:
            return {"error": "Groq API key not configured."}

        try:
            # System prompt to set the persona
            system_message = {
                "role": "system",
                "content": "Tu es un tuteur intelligent pour des élèves de primaire et collège. "
                           "Tu es patient, encourageant et pédagogique. "
                           "Tes réponses doivent être adaptées au niveau de l'élève. "
                           "N'hésite pas à utiliser des émojis pour être plus convivial."
            }
            
            # Prepend system message if not present (simple check)
            if not messages or messages[0].get('role') != 'system':
                messages.insert(0, system_message)

            response = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=messages,
                temperature=0.7,
                max_tokens=1024
            )
            return {"content": response.choices[0].message.content}
        except Exception as e:
            return {"error": str(e)}

    def generate_exercise(self, subject, level, topic, difficulty='medium', exercise_type='qcm'):
        """
        Generate a new exercise based on criteria.
        Returns a JSON object compatible with the Exercise model.
        """
        if not self.client:
            return {"error": "Groq API key not configured."}

        # Define format instructions based on exercise type
        if exercise_type == 'qcm':
            format_instructions = (
                "- type: 'qcm'\n"
                "- content: Un objet JSON contenant 'questions' (une liste d'objets, chaque objet ayant 'question' et 'options' qui est une liste de 4 choix)\n"
                "- correct_answers: Une liste contenant les index des bonnes réponses (ex: [0, 1]) correspondant à chaque question dans 'content.questions'\n"
                "IMPORTANT pour QCM: Chaque objet question dans 'content.questions' DOIT aussi avoir une clé 'correct_option' (int, 0-3) pour la validation immédiate sur mobile.\n"
            )
        else:  # classic
            format_instructions = (
                "- type: 'classic'\n"
                "- content: Un objet JSON contenant 'text' (l'énoncé détaillé de l'exercice) et 'questions' (une liste facultative d'objets ou strings pour les sous-questions)\n"
                "- correct_answers: Une liste de réponses clés ou de textes explicatifs correspondant à l'exercice\n"
            )

        # Language instruction based on subject
        language_instruction = ""
        subject_lower = subject.lower()
        if "anglais" in subject_lower or "english" in subject_lower:
            language_instruction = "IMPORTANT: Le contenu de l'exercice (texte, questions, choix) DOIT être en ANGLAIS. Seules les consignes peuvent être en français si nécessaire."
        elif "espagnol" in subject_lower:
             language_instruction = "IMPORTANT: Le contenu de l'exercice DOIT être en ESPAGNOL."
        elif "allemand" in subject_lower:
             language_instruction = "IMPORTANT: Le contenu de l'exercice DOIT être en ALLEMAND."

        # Map difficulty to French for better LLM understanding
        difficulty_map = {
            'easy': 'Facile',
            'medium': 'Moyen',
            'hard': 'Difficile'
        }
        diff_french = difficulty_map.get(difficulty, difficulty)

        print(f"DEBUG: Generating exercise with type={exercise_type}, difficulty={diff_french}")

        prompt = (
            f"Génère un exercice de {subject} pour un niveau {level} sur le thème '{topic}'.\n"
            f"Difficulté: {diff_french}.\n"
            f"Type: {exercise_type}.\n"
            f"{language_instruction}\n\n"
            "Tu DOIS répondre avec un JSON valide respectant cette structure exacte :\n"
            "{\n"
            "  \"title\": \"Titre de l'exercice\",\n"
            "  \"description\": \"Brève description ou consigne\",\n"
            "  \"type\": \"" + exercise_type + "\",\n"
            "  \"difficulty\": \"" + difficulty + "\",\n"
            "  \"content\": { ... voir format_instructions ... },\n"
            "  \"correct_answers\": [ ... ],\n"
            "  \"explanation\": \"Explication pédagogique\",\n"
            "  \"hints\": [\"Indice 1\", \"Indice 2\"],\n"
            "  \"points\": 10\n"
            "}\n\n"
            "Format spécifique pour 'content' :\n"
            f"{format_instructions}\n"
            "Réponds UNIQUEMENT avec le JSON, pas de texte superflu."
        )

        try:
            response = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": "Tu es un générateur d'exercices scolaires. Tu réponds uniquement en JSON valide."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                response_format={"type": "json_object"}
            )
            content = response.choices[0].message.content
            return json.loads(content)
        except Exception as e:
            return {"error": f"Error generating exercise: {str(e)}"}
