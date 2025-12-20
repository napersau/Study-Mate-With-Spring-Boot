import httpClient from '../config/httpClient';
import { getToken } from './localStorageService';

const documentService = {
    // Tạo tài liệu mới
    createDocument: async (documentData) => {
        try {
            const response = await httpClient.post('/documents', documentData, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy tài liệu theo danh mục
    getDocumentsByCategory: async (category) => {
        try {
            const params = category ? { category } : {};
            const response = await httpClient.get('/documents/category', { 
                params,
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy tài liệu theo ID
    getDocumentById: async (id) => {
        try {
            const response = await httpClient.get(`/documents/${id}`, {
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

export default documentService;
