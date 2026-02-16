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
                "- content: Un objet JSON contenant la question et les choix (ex: {question: '...', options: ['A', 'B', 'C', 'D']})\n"
                "- correct_answers: L'index de la réponse correcte (0, 1, 2 ou 3) OU la lettre ('A')\n"
            )
        else:  # classic
            format_instructions = (
                "- type: 'classic'\n"
                "- content: Un objet JSON contenant 'text' (énoncé de l'exercice) et 'questions' (une liste de questions)\n"
                "- correct_answers: Une liste de réponses correspondant aux questions ou un texte explicatif complet\n"
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
            f"Génère un exercice de {subject} pour un niveau {level} sur le thème '{topic}'. "
            f"Difficulté demandée: {diff_french} (Respecte scrupuleusement cette difficulté). "
            f"Type d'exercice imposé: {exercise_type}. "
            f"{language_instruction}\n"
            "Le format de sortie doit être un JSON valide avec les clés suivantes:\n"
            "- title: Titre de l'exercice\n"
            "- description: Énoncé de l'exercice\n"
            "- type: Le type d'exercice ('qcm' ou 'classic')\n"
            "- difficulty: La difficulté ('Facile', 'Moyen', 'Difficile')\n"
            f"{format_instructions}"
            "- explanation: Une explication de la réponse\n"
            "- hints: Une liste d'indices (strings)\n"
            "- points: Valeur en points (ex: 10)\n"
            "Réponds UNIQUEMENT avec le JSON complet, sans texte avant ni après."
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
