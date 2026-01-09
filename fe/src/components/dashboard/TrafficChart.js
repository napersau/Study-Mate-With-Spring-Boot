import React from 'react';
import { Activity, Clock, Calendar } from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const TrafficChart = ({ data, timeRange, onTimeRangeChange }) => {
    const timeRanges = [
        { value: 'hour', label: 'Giờ', icon: Clock },
        { value: 'day', label: 'Ngày', icon: Calendar },
        { value: 'month', label: 'Tháng', icon: Calendar },
        { value: 'year', label: 'Năm', icon: Calendar }
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-6 h-6" />
                    Lượng truy cập
                </h2>
                <div className="flex gap-2">
                    {timeRanges.map((range) => {
                        const Icon = range.icon;
                        return (
                            <button
                                key={range.value}
                                onClick={() => onTimeRangeChange(range.value)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                                    timeRange === range.value
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {range.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis 
                        dataKey={timeRange === 'hour' ? 'time' : timeRange === 'day' ? 'date' : 'month'} 
                        stroke="#9ca3af"
                    />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: 'none', 
                            borderRadius: '8px',
                            color: '#fff'
                        }}
                    />
                    <Legend />
                    <Area 
                        type="monotone" 
                        dataKey="visits" 
                        stroke="#3b82f6" 
                        fillOpacity={1} 
                        fill="url(#colorVisits)"
                        name="Lượt truy cập"
                    />
                    <Area 
                        type="monotone" 
                        dataKey="users" 
                        stroke="#8b5cf6" 
                        fillOpacity={1} 
                        fill="url(#colorUsers)"
                        name="Người dùng"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TrafficChart;
