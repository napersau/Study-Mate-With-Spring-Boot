import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Users, 
    CreditCard, 
    FileText, 
    Menu, 
    X,
    ChevronLeft,
    ChevronRight,
    LogOut
} from 'lucide-react';
import { logOut } from '../service/authenticationService';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            title: 'Dashboard',
            icon: LayoutDashboard,
            path: '/admin',
            description: 'Tổng quan hệ thống'
        },
        {
            title: 'Người dùng',
            icon: Users,
            path: '/admin/users',
            description: 'Quản lý người dùng'
        },
        {
            title: 'Flashcards',
            icon: CreditCard,
            path: '/admin/flashcards',
            description: 'Quản lý flashcards'
        },
        {
            title: 'Tài liệu',
            icon: FileText,
            path: '/admin/documents',
            description: 'Quản lý tài liệu'
        }
    ];

    const handleLogout = () => {
        logOut();
    };

    const isActive = (path) => {
        if (path === '/admin') {
            return location.pathname === '/admin';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
            {/* Sidebar - Desktop */}
            <aside
                className={`hidden md:flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 text-white transition-all duration-300 ${
                    sidebarOpen ? 'w-72' : 'w-20'
                } shadow-2xl`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    {sidebarOpen && (
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <LayoutDashboard className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Admin Panel</h1>
                                <p className="text-xs text-gray-400">Study Mate</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        {sidebarOpen ? (
                            <ChevronLeft className="w-5 h-5" />
                        ) : (
                            <ChevronRight className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-3">
                    <div className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);
                            
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className={`w-full group relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                        active
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/50'
                                            : 'hover:bg-gray-700/50'
                                    }`}
                                >
                                    <Icon className={`w-6 h-6 ${active ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                                    {sidebarOpen && (
                                        <div className="flex-1 text-left">
                                            <div className={`font-medium ${active ? 'text-white' : 'text-gray-300'}`}>
                                                {item.title}
                                            </div>
                                            <div className={`text-xs ${active ? 'text-blue-100' : 'text-gray-500'}`}>
                                                {item.description}
                                            </div>
                                        </div>
                                    )}
                                    {!sidebarOpen && (
                                        <div className="absolute left-full ml-6 px-3 py-2 bg-gray-800 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                            <div className="font-medium">{item.title}</div>
                                            <div className="text-xs text-gray-400">{item.description}</div>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </nav>

                {/* Footer */}
                <div className="border-t border-gray-700 p-4">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-600/20 text-red-400 hover:text-red-300 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        {sidebarOpen && <span className="font-medium">Đăng xuất</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-3 bg-gray-900 text-white rounded-xl shadow-lg"
            >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile Sidebar */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
                    <aside
                        className="absolute left-0 top-0 h-full w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Mobile Header */}
                        <div className="flex items-center space-x-3 p-6 border-b border-gray-700">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <LayoutDashboard className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Admin Panel</h1>
                                <p className="text-xs text-gray-400">Study Mate</p>
                            </div>
                        </div>

                        {/* Mobile Navigation */}
                        <nav className="py-6 px-3">
                            <div className="space-y-2">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.path);
                                    
                                    return (
                                        <button
                                            key={item.path}
                                            onClick={() => {
                                                navigate(item.path);
                                                setMobileMenuOpen(false);
                                            }}
                                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                                                active
                                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                                                    : 'hover:bg-gray-700/50'
                                            }`}
                                        >
                                            <Icon className="w-6 h-6" />
                                            <div className="flex-1 text-left">
                                                <div className="font-medium">{item.title}</div>
                                                <div className={`text-xs ${active ? 'text-blue-100' : 'text-gray-500'}`}>
                                                    {item.description}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </nav>

                        {/* Mobile Footer */}
                        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-700 p-4">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-600/20 text-red-400 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">Đăng xuất</span>
                            </button>
                        </div>
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="min-h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
