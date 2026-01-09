import httpClient from '../config/httpClient';

const statisticsService = {
    // Lấy thống kê tổng quan
    getOverviewStats: async () => {
        try {
            const response = await httpClient.get('/api/v1/statistics/overview');
            return response.data.result || response.data;
        } catch (error) {
            console.error('Error fetching overview stats:', error);
            throw error;
        }
    },

    // Lấy dữ liệu lượng truy cập theo khoảng thời gian
    getTrafficStats: async (timeRange = 'day') => {
        try {
            const response = await httpClient.get(`/api/v1/statistics/traffic?range=${timeRange}`);
            return response.data.result || response.data;
        } catch (error) {
            console.error('Error fetching traffic stats:', error);
            throw error;
        }
    },

    // Lấy thống kê người dùng mới
    getNewUsersStats: async (days = 7) => {
        try {
            const response = await httpClient.get(`/api/v1/statistics/users/new?days=${days}`);
            return response.data.result || response.data;
        } catch (error) {
            console.error('Error fetching new users stats:', error);
            throw error;
        }
    },

    // Lấy thống kê phân bố hoạt động
    getActivityDistribution: async () => {
        try {
            const response = await httpClient.get('/api/v1/statistics/activity/distribution');
            return response.data.result || response.data;
        } catch (error) {
            console.error('Error fetching activity distribution:', error);
            throw error;
        }
    },

    // Lấy hoạt động gần đây
    getRecentActivities: async (limit = 5) => {
        try {
            const response = await httpClient.get(`/api/v1/statistics/activities/recent?limit=${limit}`);
            return response.data.result || response.data;
        } catch (error) {
            console.error('Error fetching recent activities:', error);
            throw error;
        }
    }
};

export default statisticsService;
