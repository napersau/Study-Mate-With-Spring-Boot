import React, { useState, useEffect } from 'react';
import { 
    Users, 
    CreditCard, 
    FileText,
    Award,
    RefreshCw,
    CheckCircle
} from 'lucide-react';
import statisticsService from '../../service/statisticsService';
import {
    StatsCards,
    TrafficChart,
    ActivityPieChart,
    NewUsersChart,
    RecentActivities,
    QuickActions
} from '../../components/dashboard';

const AdminHome = () => {
    const [timeRange, setTimeRange] = useState('day'); // 'hour', 'day', 'month', 'year'
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState(null);
    const [trafficData, setTrafficData] = useState([]);
    const [newUsersData, setNewUsersData] = useState([]);
    const [activityDistribution, setActivityDistribution] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);

    // Fetch dữ liệu thống kê tổng quan
    const fetchOverviewStats = async () => {
        try {
            setLoading(true);
            const data = await statisticsService.getOverviewStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch overview stats:', error);
            // Fallback to mock data nếu API chưa sẵn sàng
            setStats({
                totalUsers: { value: 2543, change: 12, changeType: 'increase' },
                totalFlashcards: { value: 1234, change: 8, changeType: 'increase' },
                totalDocuments: { value: 567, change: 23, changeType: 'increase' },
                totalExams: { value: 89, change: 15, changeType: 'increase' }
            });
        } finally {
            setLoading(false);
        }
    };

    // Fetch dữ liệu lượng truy cập
    const fetchTrafficStats = async (range) => {
        try {
            const data = await statisticsService.getTrafficStats(range);
            setTrafficData(data);
        } catch (error) {
            console.error('Failed to fetch traffic stats:', error);
            // Fallback to mock data
            setTrafficData(getMockTrafficData(range));
        }
    };

    // Fetch người dùng mới
    const fetchNewUsersStats = async () => {
        try {
            const data = await statisticsService.getNewUsersStats(7);
            setNewUsersData(data);
        } catch (error) {
            console.error('Failed to fetch new users stats:', error);
            // Fallback to mock data
            setNewUsersData([
                { date: 'T2', visits: 2340, users: 890, newUsers: 45 },
                { date: 'T3', visits: 2560, users: 920, newUsers: 52 },
                { date: 'T4', visits: 2780, users: 1050, newUsers: 68 },
                { date: 'T5', visits: 2450, users: 980, newUsers: 41 },
                { date: 'T6', visits: 3120, users: 1200, newUsers: 89 },
                { date: 'T7', visits: 2890, users: 1100, newUsers: 73 },
                { date: 'CN', visits: 1890, users: 780, newUsers: 34 }
            ]);
        }
    };

    // Fetch phân bố hoạt động
    const fetchActivityDistribution = async () => {
        try {
            const data = await statisticsService.getActivityDistribution();
            setActivityDistribution(data);
        } catch (error) {
            console.error('Failed to fetch activity distribution:', error);
            // Fallback to mock data
            setActivityDistribution([
                { name: 'Học Flashcards', value: 45 },
                { name: 'Đọc tài liệu', value: 30 },
                { name: 'Làm đề thi', value: 15 },
                { name: 'Xem khóa học', value: 10 }
            ]);
        }
    };

    // Fetch hoạt động gần đây
    const fetchRecentActivities = async () => {
        try {
            const data = await statisticsService.getRecentActivities(5);
            setRecentActivities(data);
        } catch (error) {
            console.error('Failed to fetch recent activities:', error);
            // Fallback to mock data
            setRecentActivities([
                { user: 'khoi nguyen', action: 'Đã tạo flashcard mới', time: '5 phút trước', icon: CreditCard },
                { user: 'admin', action: 'Đã đăng nhập vào hệ thống', time: '10 phút trước', icon: CheckCircle },
                { user: 'khoi nguyen', action: 'Đã đăng ký tài khoản', time: '2 giờ trước', icon: Users },
                { user: 'user123', action: 'Hoàn thành đề thi TOEIC', time: '3 giờ trước', icon: Award },
                { user: 'student456', action: 'Đọc tài liệu mới', time: '5 giờ trước', icon: FileText }
            ]);
        }
    };

    // Mock data function for fallback
    const getMockTrafficData = (range) => {
        switch(range) {
            case 'hour':
                return Array.from({ length: 24 }, (_, i) => ({
                    time: `${i.toString().padStart(2, '0')}:00`,
                    visits: Math.floor(Math.random() * 300) + 20,
                    users: Math.floor(Math.random() * 120) + 5
                }));
            case 'day':
                return [
                    { date: 'T2', visits: 2340, users: 890, newUsers: 45 },
                    { date: 'T3', visits: 2560, users: 920, newUsers: 52 },
                    { date: 'T4', visits: 2780, users: 1050, newUsers: 68 },
                    { date: 'T5', visits: 2450, users: 980, newUsers: 41 },
                    { date: 'T6', visits: 3120, users: 1200, newUsers: 89 },
                    { date: 'T7', visits: 2890, users: 1100, newUsers: 73 },
                    { date: 'CN', visits: 1890, users: 780, newUsers: 34 }
                ];
            case 'month':
            case 'year':
                return Array.from({ length: 12 }, (_, i) => ({
                    month: `T${i + 1}`,
                    visits: Math.floor(Math.random() * 50000) + 40000,
                    users: Math.floor(Math.random() * 15000) + 10000,
                    revenue: Math.floor(Math.random() * 30000) + 20000
                }));
            default:
                return [];
        }
    };

    // Load tất cả dữ liệu khi component mount
    useEffect(() => {
        fetchOverviewStats();
        fetchNewUsersStats();
        fetchActivityDistribution();
        fetchRecentActivities();
    }, []);

    // Load lại traffic data khi thay đổi time range
    useEffect(() => {
        fetchTrafficStats(timeRange);
    }, [timeRange]);

    // Refresh tất cả dữ liệu
    const handleRefreshAll = () => {
        fetchOverviewStats();
        fetchTrafficStats(timeRange);
        fetchNewUsersStats();
        fetchActivityDistribution();
        fetchRecentActivities();
    };

    // Format stats cards từ API data
    const statsCards = stats ? [
        {
            title: 'Tổng người dùng',
            value: stats.totalUsers?.value?.toLocaleString() || '0',
            icon: Users,
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            change: `${stats.totalUsers?.change > 0 ? '+' : ''}${stats.totalUsers?.change || 0}%`,
            changeType: stats.totalUsers?.changeType || 'increase'
        },
        {
            title: 'Flashcards',
            value: stats.totalFlashcards?.value?.toLocaleString() || '0',
            icon: CreditCard,
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            change: `${stats.totalFlashcards?.change > 0 ? '+' : ''}${stats.totalFlashcards?.change || 0}%`,
            changeType: stats.totalFlashcards?.changeType || 'increase'
        },
        {
            title: 'Tài liệu',
            value: stats.totalDocuments?.value?.toLocaleString() || '0',
            icon: FileText,
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            change: `${stats.totalDocuments?.change > 0 ? '+' : ''}${stats.totalDocuments?.change || 0}%`,
            changeType: stats.totalDocuments?.changeType || 'increase'
        },
        {
            title: 'Đề thi',
            value: stats.totalExams?.value?.toLocaleString() || '0',
            icon: Award,
            color: 'from-yellow-500 to-orange-500',
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
            change: `${stats.totalExams?.change > 0 ? '+' : ''}${stats.totalExams?.change || 0}%`,
            changeType: stats.totalExams?.changeType || 'increase'
        }
    ] : [];

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
                        Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Chào mừng đến với trang quản trị Study Mate
                    </p>
                </div>
                <button
                    onClick={handleRefreshAll}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    Làm mới
                </button>
            </div>

            {/* Stats Grid */}
            <StatsCards stats={statsCards} loading={loading} />

            {/* Traffic Chart */}
            <TrafficChart 
                data={trafficData}
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
            />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ActivityPieChart data={activityDistribution} />
                <NewUsersChart data={newUsersData} />
            </div>

            {/* Recent Activities & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentActivities activities={recentActivities} />
                <QuickActions />
            </div>
        </div>
    );
};

export default AdminHome;
