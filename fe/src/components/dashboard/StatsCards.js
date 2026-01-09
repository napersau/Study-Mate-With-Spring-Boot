import React from 'react';
import { TrendingUp } from 'lucide-react';

const StatsCards = ({ stats, loading }) => {
    if (loading && (!stats || stats.length === 0)) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-pulse">
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats && stats.map((stat, index) => {
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
                                <span className={`text-sm font-semibold ${
                                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    <TrendingUp className="w-4 h-4 inline mr-1" />
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-gray-600 dark:text-gray-400 text-sm mb-1">{stat.title}</h3>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                            <div className="mt-4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className={`h-full bg-gradient-to-r ${stat.color} transition-all duration-500 group-hover:w-full`} style={{width: '70%'}}></div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StatsCards;
