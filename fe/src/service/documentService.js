import httpClient from '../config/httpClient';

const documentService = {
    // Tạo tài liệu mới
    createDocument: async (documentData) => {
        try {
            const response = await httpClient.post('/api/v1/documents', documentData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy tài liệu theo danh mục
    getDocumentsByCategory: async (category) => {
        try {
            const params = category ? { category } : {};
            const response = await httpClient.get('/api/v1/documents/category', { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default documentService;
