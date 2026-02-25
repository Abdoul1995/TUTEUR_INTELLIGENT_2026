import os
import json
from openai import OpenAI
from django.conf import settings

class AIService:
    def __init__(self):
        import logging
        self.logger = logging.getLogger(__name__)
        self.api_key = os.getenv('GROQ_API_KEY')
        self.client = None
        if self.api_key:
            # Masked logging for security
            masked_key = f"{self.api_key[:6]}...{self.api_key[-4:]}" if len(self.api_key) > 10 else "***"
            self.logger.info(f"GROQ_API_KEY found: {masked_key}")
            try:
                self.client = OpenAI(
                    base_url="https://api.groq.com/openai/v1",
                    api_key=self.api_key
                )
                self.logger.info("AIService initialized with Groq client.")
            except Exception as e:
                self.logger.error(f"Failed to initialize OpenAI client: {str(e)}")
        else:
            self.logger.warning("GROQ_API_KEY not found in environment variables.")

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

    def generate_exercise(self, subject, level, topic, difficulty='medium', exercise_type='qcm', language='fr'):
        """
        Generate a new exercise based on criteria.
        Returns a JSON object compatible with the Exercise model.
        """
        if not self.client:
            return {"error": "Groq API key not configured."}

        subject_lower = subject.lower()
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
                "- content: Un objet JSON contenant 'text' (l'énoncé détaillé de l'exercice) et 'questions' (une liste de strings pour les sous-questions)\n"
                "IMPORTANT pour Classic: 'correct_answers' DOIT OBLIGATOIREMENT être une liste (array) contenant EXACTEMENT le même nombre d'éléments que la liste 'content.questions'. "
                "N'oubliez aucune question dans la correction, especially the very last one. Chaque élément de 'correct_answers' doit être la correction détaillée de la question correspondante au même index.\n"
            )

        # LaTeX instruction for math
        math_instruction = ""
        if "math" in subject_lower:
            math_instruction = "IMPORTANT: Puisque c'est un exercice de mathématiques, utilise la notation LaTeX pour toutes les expressions mathématiques (ex: $x^2$, $\\frac{1}{2}$, $\\sqrt{x}$). Toutes les formules doivent être entourées de symboles $.\n"

        # Language instruction
        lang_name = "Français" if language == 'fr' else "Anglais"
        language_instruction = f"IMPORTANT: L'exercice (titre, description, questions, options, explications) DOIT être rédigé entièrement en {lang_name}."
        
        # Override if it's a specific language subject
        if "anglais" in subject_lower or "english" in subject_lower:
            language_instruction = "IMPORTANT: Le contenu de l'exercice (texte, questions, choix) DOIT être en ANGLAIS. Seules les consignes peuvent être en français si nécessaire."
        elif "espagnol" in subject_lower:
             language_instruction = "IMPORTANT: Le contenu de l'exercice DOIT être en ESPAGNOL."
        elif "allemand" in subject_lower:
             language_instruction = "IMPORTANT: Le contenu de l'exercice DOIT être en ALLEMAND."

        # Map difficulty to French/English for better LLM understanding
        if language == 'en':
            difficulty_map = {'easy': 'Easy', 'medium': 'Medium', 'hard': 'Hard'}
        else:
            difficulty_map = {'easy': 'Facile', 'medium': 'Moyen', 'hard': 'Difficile'}
            
        diff_label = difficulty_map.get(difficulty, difficulty)

        print(f"DEBUG: Generating exercise with type={exercise_type}, difficulty={diff_label}, language={language}")

        prompt = (
            f"Génère un exercice de {subject} pour un niveau {level} sur le thème '{topic}'.\n"
            f"Difficulté: {diff_label}.\n"
            f"Type: {exercise_type}.\n"
            f"{language_instruction}\n"
            f"{math_instruction}\n\n"
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
