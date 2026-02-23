import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import courseService from '../../service/courseService';
import paymentService from '../../service/paymentService';

const useCourseDetail = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paying, setPaying] = useState(false);
    const [payError, setPayError] = useState(null);

    useEffect(() => {
        fetchCourseDetail();
    }, [courseId]);

    const fetchCourseDetail = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await courseService.getCourseById(courseId);

            if (response.code === 1000) {
                setCourse(response.result);
            } else {
                setError(response.message || 'Không thể tải thông tin khóa học');
            }
        } catch (err) {
            console.error('Error fetching course:', err);
            setError('Có lỗi xảy ra khi tải thông tin khóa học');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Khởi tạo thanh toán VNPay cho khóa học.
     * Backend trả về paymentUrl → redirect thẳng.
     */
    const handlePayVnPay = async () => {
        if (!course) return;
        try {
            setPaying(true);
            setPayError(null);

            const response = await paymentService.createVnPayPayment(course.price, courseId);

            if (response && response.result && response.result.paymentUrl) {
                // Chuyển hướng sang cổng VNPay
                window.location.href = response.result.paymentUrl;
            } else {
                setPayError('Không thể tạo liên kết thanh toán. Vui lòng thử lại.');
            }
        } catch (err) {
            // Log chi tiết response từ backend để debug
            console.error('Payment error - backend response data:', err?.response?.data);
            console.error('Payment error - status:', err?.response?.status);
            console.error('Payment error full:', err);
            // Lấy message thực từ backend (nếu có)
            const backendMsg =
                err?.response?.data?.message ||
                err?.response?.data?.result ||
                err?.message ||
                'Có lỗi xảy ra khi khởi tạo thanh toán.';
            setPayError(backendMsg);
        } finally {
            setPaying(false);
        }
    };

    // Khoá học miễn phí (price null hoặc 0)
    const isFree = !course?.price || course.price === 0;

    // Backend trả về isEnrolled nếu user đã sở hữu khóa học
    const isEnrolled = !!course?.isEnrolled;

    return {
        courseId,
        course,
        loading,
        error,
        paying,
        payError,
        isFree,
        isEnrolled,
        handlePayVnPay,
    };
};

export default useCourseDetail;
