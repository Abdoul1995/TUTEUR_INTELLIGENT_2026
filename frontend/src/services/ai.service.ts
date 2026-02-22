import { api } from './api';

export const aiService = {
    chat: async (messages: any[]) => {
        try {
            const response = await api.client.post('ai/chat/', { messages });
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
        exerciseType: 'qcm' | 'classic' = 'qcm',
        language: string = 'fr'
    ) => {
        try {
            const response = await api.client.post('ai/generate-exercise/', {
                subject,
                level,
                topic,
                difficulty,
                exercise_type: exerciseType,
                language
            });
            return response.data;
        } catch (error) {
            console.error('Error generating exercise:', error);
            throw error;
        }
    }
};
