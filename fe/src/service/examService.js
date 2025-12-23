import httpClient from '../config/httpClient';
import { getToken } from './localStorageService';

const examService = {
    // Lấy tất cả đề thi
    getAllExams: async () => {
        try {
            const response = await httpClient.get('/exam', {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy đề thi theo loại
    getExamsByType: async (examType) => {
        try {
            const response = await httpClient.get('/exam/type', {
                params: { examType },
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy chi tiết đề thi theo ID
    getExamById: async (id) => {
        try {
            const response = await httpClient.get(`/exam/${id}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default examService;
