import React from 'react';

const RecentActivities = ({ activities }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Hoạt động gần đây
            </h2>
            <div className="space-y-4">
                {activities.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                        <div
                            key={index}
                            className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {activity.user}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {activity.action}
                                </p>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-500">
                                {activity.time}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RecentActivities;
