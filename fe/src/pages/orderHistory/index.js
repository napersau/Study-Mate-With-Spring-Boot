import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, CheckCircle, XCircle, Clock, BookOpen, Loader2 } from 'lucide-react';
import paymentService from '../../service/paymentService';

const STATUS_MAP = {
    COMPLETED: { label: 'Thành công', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', icon: <CheckCircle className="w-4 h-4" /> },
    PENDING:   { label: 'Đang xử lý', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: <Clock className="w-4 h-4" /> },
    FAILED:    { label: 'Thất bại',   color: 'text-red-600 dark:text-red-400',    bg: 'bg-red-100 dark:bg-red-900/30',    icon: <XCircle className="w-4 h-4" /> },
};

const OrderHistory = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        paymentService.getAllOrders()
            .then((res) => {
                setOrders(res?.result || []);
            })
            .catch(() => setError('Không thể tải lịch sử giao dịch. Vui lòng thử lại.'))
            .finally(() => setLoading(false));
    }, []);

    const formatAmount = (amount) =>
        amount != null ? Number(amount).toLocaleString('vi-VN') + 'đ' : '—';

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-10 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                        <ClipboardList className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lịch sử giao dịch</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Danh sách các giao dịch mua khóa học của bạn</p>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                {/* Empty */}
                {!loading && !error && orders.length === 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-12 text-center">
                        <ClipboardList className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">Bạn chưa có giao dịch nào.</p>
                        <button
                            onClick={() => navigate('/courses')}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            <BookOpen className="w-5 h-5" />
                            Khám phá khóa học
                        </button>
                    </div>
                )}

                {/* Order list */}
                {!loading && !error && orders.length > 0 && (
                    <div className="space-y-4">
                        {orders.map((order, idx) => {
                            const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.PENDING;
                            return (
                                <div
                                    key={order.id || idx}
                                    className="bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-md transition-shadow duration-200 p-6"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        {/* Left: course & txn info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <BookOpen className="w-4 h-4 text-purple-500 shrink-0" />
                                                <span className="font-semibold text-gray-900 dark:text-white truncate">
                                                    {order.courseName || order.courseId || 'Khóa học'}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                {order.vnpTxnRef && (
                                                    <span>Mã đơn: <span className="font-medium text-gray-700 dark:text-gray-200">{order.vnpTxnRef}</span></span>
                                                )}
                                                {order.transactionNo && (
                                                    <span>Mã GD: <span className="font-medium text-gray-700 dark:text-gray-200">{order.transactionNo}</span></span>
                                                )}
                                                {order.bankCode && (
                                                    <span>Ngân hàng: <span className="font-medium text-gray-700 dark:text-gray-200">{order.bankCode}</span></span>
                                                )}
                                                <span>Thời gian: <span className="font-medium text-gray-700 dark:text-gray-200">{formatDate(order.createdAt || order.paymentTime)}</span></span>
                                            </div>
                                        </div>

                                        {/* Right: amount & status */}
                                        <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 shrink-0">
                                            <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                                                {formatAmount(order.amount)}
                                            </span>
                                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${statusInfo.bg} ${statusInfo.color}`}>
                                                {statusInfo.icon}
                                                {statusInfo.label}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Back button */}
                {!loading && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                            ← Quay lại
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
