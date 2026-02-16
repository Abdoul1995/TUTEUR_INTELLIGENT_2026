import axios from 'axios';

const API_URL = 'http://localhost:8000/api/ai';

export const aiService = {
    chat: async (messages: any[]) => {
        try {
            const response = await axios.post(`${API_URL}/chat/`, { messages });
            return response.data;
        } catch (error) {
            console.error('Error in AI chat:', error);
            throw error;
        }
    },

    generateExercise: async (
        subject: string,
        level: string,
        topic: string,
        difficulty: string = 'medium',
        exerciseType: 'qcm' | 'classic' = 'qcm'
    ) => {
        try {
            const response = await axios.post(`${API_URL}/generate-exercise/`, {
                subject,
                level,
                topic,
                difficulty,
                exercise_type: exerciseType
            });
            return response.data;
        } catch (error) {
            console.error('Error generating exercise:', error);
            throw error;
        }
    }
};
