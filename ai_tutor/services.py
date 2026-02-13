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

    def generate_exercise(self, subject, level, topic, difficulty='medium'):
        """
        Generate a new exercise based on criteria.
        Returns a JSON object compatible with the Exercise model.
        """
        if not self.client:
            return {"error": "Groq API key not configured."}

        prompt = (
            f"Génère un exercice de {subject} pour un niveau {level} sur le thème '{topic}'. "
            f"Difficulté: {difficulty}. "
            "Le format de sortie doit être un JSON valide avec les clés suivantes:\n"
            "- title: Titre de l'exercice\n"
            "- description: Énoncé de l'exercice\n"
            "- type: 'qcm' (pour ce prototype, on se concentre sur les QCM)\n"
            "- content: Un objet JSON contenant la question et les choix (ex: {question: '...', options: ['A', 'B', 'C', 'D']})\n"
            "- correct_answers: La réponse correcte (ex: 'A')\n"
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
