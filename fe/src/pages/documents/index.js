import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, FileText, GraduationCap, Lightbulb, Code, Database, ArrowRight, Sparkles } from 'lucide-react';

const Documents = () => {
    const navigate = useNavigate();

    const categories = [
        { 
            id: 'PROGRAMMING', 
            name: 'Lập trình', 
            description: 'Các tài liệu về ngôn ngữ lập trình, framework, và công nghệ',
            icon: Code,
            gradient: 'from-blue-500 to-cyan-500',
            bgLight: 'bg-blue-50',
            bgDark: 'dark:bg-blue-900/20'
        },
        { 
            id: 'DATABASE', 
            name: 'Cơ sở dữ liệu', 
            description: 'Tài liệu về SQL, NoSQL, và quản lý database',
            icon: Database,
            gradient: 'from-green-500 to-emerald-500',
            bgLight: 'bg-green-50',
            bgDark: 'dark:bg-green-900/20'
        },
        { 
            id: 'ALGORITHM', 
            name: 'Thuật toán', 
            description: 'Các thuật toán và cấu trúc dữ liệu',
            icon: Lightbulb,
            gradient: 'from-yellow-500 to-orange-500',
            bgLight: 'bg-yellow-50',
            bgDark: 'dark:bg-yellow-900/20'
        },
        { 
            id: 'THEORY', 
            name: 'Lý thuyết', 
            description: 'Tài liệu lý thuyết về khoa học máy tính',
            icon: BookOpen,
            gradient: 'from-purple-500 to-pink-500',
            bgLight: 'bg-purple-50',
            bgDark: 'dark:bg-purple-900/20'
        },
        { 
            id: 'TUTORIAL', 
            name: 'Hướng dẫn', 
            description: 'Các hướng dẫn chi tiết từng bước',
            icon: GraduationCap,
            gradient: 'from-red-500 to-rose-500',
            bgLight: 'bg-red-50',
            bgDark: 'dark:bg-red-900/20'
        },
        { 
            id: 'OTHER', 
            name: 'Khác', 
            description: 'Các tài liệu khác',
            icon: FileText,
            gradient: 'from-gray-500 to-slate-500',
            bgLight: 'bg-gray-50',
            bgDark: 'dark:bg-gray-900/20'
        }
    ];

    const handleCategoryClick = (categoryId) => {
        navigate(`/documents/${categoryId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-12">
                {/* Header với animation */}
                <div className="text-center mb-12 animate-fade-in">
                    <div className="flex items-center justify-center mb-4">
                        <Sparkles className="w-8 h-8 text-yellow-500 mr-2 animate-pulse" />
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                            Tài liệu học tập
                        </h1>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Khám phá kho tài liệu phong phú với hơn 6 danh mục chuyên sâu
                    </p>
                </div>

                {/* Category Cards với hiệu ứng đẹp */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category, index) => {
                        const Icon = category.icon;
                        return (
                            <div
                                key={category.id}
                                onClick={() => handleCategoryClick(category.id)}
                                className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden transform hover:-translate-y-2"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Gradient Border Effect */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`}></div>
                                
                                {/* Card Content */}
                                <div className="relative bg-white dark:bg-gray-800 m-[2px] rounded-2xl p-8">
                                    {/* Icon với gradient background */}
                                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${category.gradient} shadow-lg mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}>
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                                        {category.name}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                                        {category.description}
                                    </p>

                                    {/* Arrow với animation */}
                                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                        <span className="mr-2">Khám phá</span>
                                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" />
                                    </div>
                                </div>

                                {/* Background Pattern */}
                                <div className={`absolute -right-8 -bottom-8 w-32 h-32 ${category.bgLight} ${category.bgDark} rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700`}></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Documents;
