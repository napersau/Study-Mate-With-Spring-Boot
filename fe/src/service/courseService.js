import httpClient from '../config/httpClient';
import { getToken } from './localStorageService';

const courseService = {
    // Tạo khóa học mới (Admin only)
    createCourse: async (courseData) => {
        try {
            const response = await httpClient.post('/courses', courseData, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy chi tiết khóa học theo ID
    getCourseById: async (id) => {
        try {
            const response = await httpClient.get(`/courses/${id}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Lấy tất cả khóa học
    getAllCourses: async () => {
        try {
            const response = await httpClient.get('/courses/all', {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update khóa học (sẽ cần thêm API ở backend)
    updateCourse: async (id, courseData) => {
        try {
            const response = await httpClient.put(`/courses/${id}`, courseData, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete khóa học (sẽ cần thêm API ở backend)
    deleteCourse: async (id) => {
        try {
            const response = await httpClient.delete(`/courses/${id}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Publish khóa học
    publishCourse: async (id) => {
        try {
            const response = await httpClient.put(`/courses/${id}`, null, {
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

export default courseService;
