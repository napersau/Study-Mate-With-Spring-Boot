import React from 'react';
import { UserCheck } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const NewUsersChart = ({ data }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <UserCheck className="w-6 h-6" />
                Người dùng mới (7 ngày)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="date" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: 'none', 
                            borderRadius: '8px',
                            color: '#fff'
                        }}
                    />
                    <Bar dataKey="newUsers" fill="#10b981" radius={[8, 8, 0, 0]} name="Người dùng mới" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default NewUsersChart;
