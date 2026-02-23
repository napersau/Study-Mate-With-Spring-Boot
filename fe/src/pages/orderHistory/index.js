import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ClipboardList, CheckCircle, XCircle, Clock,
    BookOpen, Loader2, User, Hash, CalendarDays, CreditCard, ArrowLeft,
} from 'lucide-react';
import paymentService from '../../service/paymentService';

const STATUS_MAP = {
    COMPLETED: {
        label: 'Thành công',
        color: 'text-green-700 dark:text-green-300',
        bg: 'bg-green-100 dark:bg-green-900/40',
        border: 'border-green-300 dark:border-green-700',
        icon: <CheckCircle className="w-4 h-4" />,
    },
    PENDING: {
        label: 'Đang xử lý',
        color: 'text-yellow-700 dark:text-yellow-300',
        bg: 'bg-yellow-100 dark:bg-yellow-900/40',
        border: 'border-yellow-300 dark:border-yellow-700',
        icon: <Clock className="w-4 h-4" />,
    },
    FAILED: {
        label: 'Thất bại',
        color: 'text-red-700 dark:text-red-300',
        bg: 'bg-red-100 dark:bg-red-900/40',
        border: 'border-red-300 dark:border-red-700',
        icon: <XCircle className="w-4 h-4" />,
    },
};

const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-center gap-2 text-sm">
        <span className="text-purple-400 dark:text-purple-500 shrink-0">{icon}</span>
        <span className="text-gray-500 dark:text-gray-400 shrink-0">{label}:</span>
        <span className="font-medium text-gray-800 dark:text-gray-100 truncate">{value || '—'}</span>
    </div>
);

const OrderHistory = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        paymentService.getAllOrders()
            .then((res) => {
                const list = Array.isArray(res?.result) ? res.result : [];
                setOrders(list);
            })
            .catch(() => setError('Không thể tải lịch sử giao dịch. Vui lòng thử lại.'))
            .finally(() => setLoading(false));
    }, []);

    const formatAmount = (amount) =>
        amount != null ? Number(amount).toLocaleString('vi-VN') + ' ₫' : '—';

    const formatDate = (dateStr) => {
        if (!dateStr) return null;
        return new Date(dateStr).toLocaleString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-10 px-4">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200 dark:shadow-purple-900/40">
                        <ClipboardList className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lịch sử giao dịch</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Danh sách đơn hàng mua khóa học của bạn</p>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col justify-center items-center py-24 gap-4">
                        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Đang tải dữ liệu...</p>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center text-red-600 dark:text-red-400">
                        <XCircle className="w-10 h-10 mx-auto mb-3 opacity-70" />
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                {/* Empty */}
                {!loading && !error && orders.length === 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-14 text-center">
                        <div className="w-20 h-20 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ClipboardList className="w-10 h-10 text-purple-300 dark:text-purple-600" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 font-medium mb-6">Bạn chưa có giao dịch nào.</p>
                        <button
                            onClick={() => navigate('/courses')}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-7 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                        >
                            <BookOpen className="w-5 h-5" />
                            Khám phá khóa học
                        </button>
                    </div>
                )}

                {/* Order list */}
                {!loading && !error && orders.length > 0 && (
                    <div className="space-y-4">
                        {/* Summary bar */}
                        <div className="flex items-center justify-between px-1 mb-2">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold text-gray-700 dark:text-gray-200">{orders.length}</span> giao dịch
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Tổng:{' '}
                                <span className="font-semibold text-purple-600 dark:text-purple-400">
                                    {formatAmount(orders.reduce((s, o) => s + (o.amount || 0), 0))}
                                </span>
                            </p>
                        </div>

                        {orders.map((order, idx) => {
                            const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.PENDING;
                            return (
                                <div
                                    key={order.id || idx}
                                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                                >
                                    {/* Top accent bar based on status */}
                                    <div className={`h-1 w-full ${
                                        order.status === 'COMPLETED' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                                        order.status === 'FAILED'    ? 'bg-gradient-to-r from-red-400 to-rose-500' :
                                        'bg-gradient-to-r from-yellow-400 to-amber-500'
                                    }`} />

                                    <div className="p-5">
                                        {/* Course title + status badge */}
                                        <div className="flex items-start justify-between gap-3 mb-4">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/40 rounded-xl flex items-center justify-center shrink-0">
                                                    <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                                                        {order.courseTitle || 'Khóa học'}
                                                    </p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                                        #{order.id}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border shrink-0 ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}>
                                                {statusInfo.icon}
                                                {statusInfo.label}
                                            </span>
                                        </div>

                                        {/* Divider */}
                                        <div className="border-t border-dashed border-gray-100 dark:border-gray-700 mb-4" />

                                        {/* Info grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <InfoRow
                                                icon={<User className="w-3.5 h-3.5" />}
                                                label="Tài khoản"
                                                value={order.username}
                                            />
                                            {order.vnpTxnRef && (
                                                <InfoRow
                                                    icon={<Hash className="w-3.5 h-3.5" />}
                                                    label="Mã GD VNPay"
                                                    value={order.vnpTxnRef}
                                                />
                                            )}
                                            <InfoRow
                                                icon={<CalendarDays className="w-3.5 h-3.5" />}
                                                label="Ngày tạo"
                                                value={formatDate(order.createdDate)}
                                            />
                                            {order.payDate && (
                                                <InfoRow
                                                    icon={<CreditCard className="w-3.5 h-3.5" />}
                                                    label="Thanh toán lúc"
                                                    value={formatDate(order.payDate)}
                                                />
                                            )}
                                        </div>

                                        {/* Amount */}
                                        <div className="mt-4 flex items-center justify-end">
                                            <div className="bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-xl">
                                                <span className="text-xs text-purple-500 dark:text-purple-400 font-medium mr-1">Số tiền</span>
                                                <span className="text-lg font-bold text-purple-700 dark:text-purple-300">
                                                    {formatAmount(order.amount)}
                                                </span>
                                            </div>
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
                            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Quay lại
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;




