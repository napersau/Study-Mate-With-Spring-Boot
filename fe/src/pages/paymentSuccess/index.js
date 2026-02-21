import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    CheckCircle,
    XCircle,
    Home,
    BookOpen,
    Loader2,
    ArrowRight,
} from 'lucide-react';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'failed'
    const [info, setInfo] = useState({});

    useEffect(() => {
        const responseCode = searchParams.get('vnp_ResponseCode');
        const txnRef = searchParams.get('vnp_TxnRef');
        const amount = searchParams.get('vnp_Amount'); // tính bằng đồng * 100
        const orderInfo = searchParams.get('vnp_OrderInfo');
        const bankCode = searchParams.get('vnp_BankCode');
        const transactionNo = searchParams.get('vnp_TransactionNo');

        setInfo({
            txnRef,
            amount: amount ? Number(amount) / 100 : null,
            orderInfo,
            bankCode,
            transactionNo,
        });

        if (responseCode === '00') {
            setStatus('success');
        } else {
            setStatus('failed');
        }
    }, [searchParams]);

    if (status === 'loading') {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
            </div>
        );
    }

    const isSuccess = status === 'success';

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-10 text-center">
                {/* Icon */}
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${isSuccess ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                    {isSuccess
                        ? <CheckCircle className="w-14 h-14 text-green-500" />
                        : <XCircle className="w-14 h-14 text-red-500" />
                    }
                </div>

                {/* Title */}
                <h1 className={`text-3xl font-bold mb-2 ${isSuccess ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                    {isSuccess
                        ? 'Khóa học đã được mở khóa. Chúc bạn học tốt!'
                        : 'Giao dịch không thành công. Vui lòng thử lại.'}
                </p>

                {/* Transaction Info */}
                {(info.txnRef || info.amount || info.transactionNo) && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 mb-8 text-left space-y-3 text-sm">
                        {info.txnRef && (
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Mã đơn hàng</span>
                                <span className="font-semibold text-gray-900 dark:text-white">{info.txnRef}</span>
                            </div>
                        )}
                        {info.transactionNo && (
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Mã giao dịch</span>
                                <span className="font-semibold text-gray-900 dark:text-white">{info.transactionNo}</span>
                            </div>
                        )}
                        {info.amount && (
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Số tiền</span>
                                <span className="font-bold text-purple-600 dark:text-purple-400">
                                    {info.amount.toLocaleString('vi-VN')}đ
                                </span>
                            </div>
                        )}
                        {info.bankCode && (
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Ngân hàng</span>
                                <span className="font-semibold text-gray-900 dark:text-white">{info.bankCode}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => navigate('/courses')}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                        <BookOpen className="w-5 h-5" />
                        <span>Danh sách khóa học</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => navigate('/home')}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold py-3 rounded-xl hover:shadow-md transition-all duration-300"
                    >
                        <Home className="w-5 h-5" />
                        <span>Trang chủ</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
