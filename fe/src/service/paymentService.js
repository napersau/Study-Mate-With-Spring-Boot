import httpClient from '../config/httpClient';
import { getToken } from './localStorageService';

const paymentService = {
    /**
     * Tạo URL thanh toán VNPay cho khóa học.
     * Backend đọc các param qua HttpServletRequest nên truyền qua query string.
     * @param {number} amount - Số tiền (VND)
     * @param {string|number} courseId - ID khóa học
     * @param {string} bankCode - Mã ngân hàng (rỗng = để VNPay hiển thị tất cả)
     */
    createVnPayPayment: async (amount, courseId, bankCode = '') => {
        try {
            const response = await httpClient.get('/payment/vn-pay', {
                params: {
                    amount,
                    courseId,
                    bankCode,
                },
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Kiểm tra trạng thái thanh toán từ callback VNPay
     * (Dùng khi cần xác nhận phía backend sau khi redirect)
     */
    verifyCallback: async (params) => {
        try {
            const response = await httpClient.get('/payment/vn-pay-callback', {
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
};

export default paymentService;
