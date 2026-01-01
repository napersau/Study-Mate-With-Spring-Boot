import httpClient from '../config/httpClient';
import { getToken } from './localStorageService';

const aiService = {
    // Chat với AI
    chatWithAI: async (message) => {
        try {
            const response = await httpClient.post('/ai/chat', 
                { message },
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            // Extract result from ApiResponse structure {code, result, totalPages}
            return response.data.result || response.data;
        } catch (error) {
            throw error;
        }
    },

    // Dịch văn bản
    translateText: async (text) => {
        try {
            const response = await httpClient.post('/ai/translate',
                { text },
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            // Extract result from ApiResponse structure {code, result, totalPages}
            return response.data.result || response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default aiService;
