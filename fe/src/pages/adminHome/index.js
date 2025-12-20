import React from 'react';
import { 
    Users, 
    CreditCard, 
    FileText, 
    TrendingUp,
    Activity,
    CheckCircle
} from 'lucide-react';

const AdminHome = () => {
    const stats = [
        {
            title: 'Tổng người dùng',
            value: '2',
            icon: Users,
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            change: '+12%',
            changeType: 'increase'
        },
        {
            title: 'Flashcards',
            value: '0',
            icon: CreditCard,
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            change: '+8%',
            changeType: 'increase'
        },
        {
            title: 'Tài liệu',
            value: '0',
            icon: FileText,
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            change: '+23%',
            changeType: 'increase'
        },
        {
            title: 'Hoạt động hôm nay',
            value: '156',
            icon: Activity,
            color: 'from-orange-500 to-red-500',
            bgColor: 'bg-orange-50 dark:bg-orange-900/20',
            change: '+5%',
            changeType: 'increase'
        }
    ];

    const recentActivities = [
        { user: 'khoi nguyen', action: 'Đã tạo flashcard mới', time: '5 phút trước', icon: CreditCard },
        { user: 'admin', action: 'Đã đăng nhập vào hệ thống', time: '10 phút trước', icon: CheckCircle },
        { user: 'khoi nguyen', action: 'Đã đăng ký tài khoản', time: '2 giờ trước', icon: Users },
    ];

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
                    Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Chào mừng đến với trang quản trị Study Mate
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className={`flex items-center space-x-1 text-sm font-semibold ${
                                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        <TrendingUp className="w-4 h-4" />
                                        <span>{stat.change}</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {stat.title}
                                    </div>
                                </div>
                            </div>
                            <div className={`h-1 bg-gradient-to-r ${stat.color}`}></div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activities Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                        Hoạt động gần đây
                    </h2>
                    <div className="space-y-4">
                        {recentActivities.map((activity, index) => {
                            const Icon = activity.icon;
                            return (
                                <div
                                    key={index}
                                    className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                >
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                                            <span className="font-bold">{activity.user}</span> {activity.action}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Quick Actions Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                        Thao tác nhanh
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="group p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl hover:shadow-lg transition-all">
                            <Users className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                            <div className="text-sm font-semibold text-gray-800 dark:text-white">
                                Quản lý người dùng
                            </div>
                        </button>
                        <button className="group p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl hover:shadow-lg transition-all">
                            <CreditCard className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                            <div className="text-sm font-semibold text-gray-800 dark:text-white">
                                Thêm Flashcard
                            </div>
                        </button>
                        <button className="group p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl hover:shadow-lg transition-all">
                            <FileText className="w-8 h-8 text-green-600 dark:text-green-400 mb-3 group-hover:scale-110 transition-transform" />
                            <div className="text-sm font-semibold text-gray-800 dark:text-white">
                                Tạo tài liệu
                            </div>
                        </button>
                        <button className="group p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl hover:shadow-lg transition-all">
                            <Activity className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-3 group-hover:scale-110 transition-transform" />
                            <div className="text-sm font-semibold text-gray-800 dark:text-white">
                                Xem báo cáo
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
