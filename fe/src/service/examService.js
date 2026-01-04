import httpClient from '../config/httpClient';
import { getToken } from './localStorageService';

const examService = {
    // Lấy tất cả đề thi
    getAllExams: async () => {
        try {
            const response = await httpClient.get('/exams', {
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
            const response = await httpClient.get('/exams/type', {
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
            const response = await httpClient.get(`/exams/${id}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Tạo đề thi mới (Admin)
    createExam: async (examData) => {
        try {
            const response = await httpClient.post('/exams', examData, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Cập nhật đề thi (Admin)
    updateExam: async (id, examData) => {
        try {
            const response = await httpClient.put(`/exams/${id}`, examData, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Xóa đề thi (Admin)
    deleteExam: async (id) => {
        try {
            const response = await httpClient.delete(`/exams/${id}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy các Question Groups chưa có Exam theo type
    getAvailableQuestionGroups: async (type) => {
        try {
            const response = await httpClient.get('/question-groups', {
                params: { type },
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
