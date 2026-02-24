import httpClient from '../config/httpClient';
import { getToken } from './localStorageService';

const paymentService = {
    /**
     * Tạo URL thanh toán VNPay.
     * @param {number} amount - Số tiền cần thanh toán (VND)
     * @param {number} courseId - ID khóa học
     * @param {string} [bankCode=''] - Mã ngân hàng (tùy chọn)
     * @param {string} [language='vn'] - Ngôn ngữ (tùy chọn)
     */
    createVnPayPayment: async (amount, courseId, platform = 'web', bankCode = '', language = 'vn') => {
        const token = getToken();
        if (!token) {
            throw new Error('Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.');
        }
        try {
            const response = await httpClient.get('/payment/vn-pay', {
                params: {
                    amount,
                    courseId,
                    bankCode,
                    language,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
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

    /**
     * Xử lý thanh toán thành công – cập nhật order và mở khóa course.
     * @param {string} vnpTxnRef - Mã giao dịch VNPay (vnp_TxnRef)
     */
    processPayment: async (vnpTxnRef) => {
        try {
            const response = await httpClient.post('/order/process-payment', null, {
                params: { vnpTxnRef },
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
     * Lấy danh sách lịch sử giao dịch của người dùng hiện tại.
     */
    getAllOrders: async () => {
        try {
            const response = await httpClient.get('/order/list', {
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
