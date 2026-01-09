import React from 'react';
import { Users, CreditCard, FileText, Activity } from 'lucide-react';

const QuickActions = () => {
    const actions = [
        { icon: Users, label: 'Quản lý người dùng', color: 'blue' },
        { icon: CreditCard, label: 'Thêm Flashcard', color: 'purple' },
        { icon: FileText, label: 'Tạo tài liệu', color: 'green' },
        { icon: Activity, label: 'Xem báo cáo', color: 'orange' }
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Thao tác nhanh
            </h2>
            <div className="grid grid-cols-2 gap-4">
                {actions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                        <button
                            key={index}
                            className={`p-4 rounded-xl bg-${action.color}-50 dark:bg-${action.color}-900/20 hover:bg-${action.color}-100 dark:hover:bg-${action.color}-900/30 transition-all text-center group`}
                        >
                            <Icon className={`w-8 h-8 text-${action.color}-600 dark:text-${action.color}-400 mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                            <p className={`text-sm font-semibold text-${action.color}-900 dark:text-${action.color}-100`}>
                                {action.label}
                            </p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default QuickActions;
