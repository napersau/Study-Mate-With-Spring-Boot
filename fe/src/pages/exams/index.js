import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    BookOpen, 
    Clock, 
    FileText, 
    Award,
    Sparkles,
    Filter,
    ChevronRight
} from 'lucide-react';
import examService from '../../service/examService';

const ExamList = () => {
    const navigate = useNavigate();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedType, setSelectedType] = useState('ALL');

    // Mapping exam types với tiếng Việt và icons
    const examTypeInfo = {
        ALL: { 
            label: 'Tất cả', 
            icon: BookOpen, 
            color: 'from-purple-500 to-pink-500',
            bgLight: 'bg-purple-50',
            textColor: 'text-purple-600'
        },
        TOEIC_FULL_TEST: { 
            label: 'TOEIC Full Test', 
            icon: Award, 
            color: 'from-blue-500 to-cyan-500',
            bgLight: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        TOEIC_MINI_TEST: { 
            label: 'TOEIC Mini Test', 
            icon: FileText, 
            color: 'from-green-500 to-teal-500',
            bgLight: 'bg-green-50',
            textColor: 'text-green-600'
        },
        IELTS_ACADEMIC: { 
            label: 'IELTS Academic', 
            icon: BookOpen, 
            color: 'from-orange-500 to-red-500',
            bgLight: 'bg-orange-50',
            textColor: 'text-orange-600'
        },
        IELTS_GENERAL: { 
            label: 'IELTS General', 
            icon: FileText, 
            color: 'from-pink-500 to-rose-500',
            bgLight: 'bg-pink-50',
            textColor: 'text-pink-600'
        },
        MOCK_TEST: { 
            label: 'Mock Test', 
            icon: Sparkles, 
            color: 'from-indigo-500 to-purple-500',
            bgLight: 'bg-indigo-50',
            textColor: 'text-indigo-600'
        }
    };

    useEffect(() => {
        fetchExams();
    }, [selectedType]);

    const fetchExams = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = selectedType === 'ALL' 
                ? await examService.getAllExams()
                : await examService.getExamsByType(selectedType);

            if (response.code === 1000) {
                setExams(response.result);
            } else {
                setError(response.message || 'Không thể tải danh sách đề thi');
            }
        } catch (err) {
            console.error('Error fetching exams:', err);
            setError('Có lỗi xảy ra khi tải danh sách đề thi');
        } finally {
            setLoading(false);
        }
    };

    const handleStartExam = (examId) => {
        navigate(`/exams/${examId}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">Đang tải đề thi...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg">
                    <p className="font-semibold">Lỗi: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full mb-4 shadow-lg">
                        <Sparkles className="w-5 h-5" />
                        <span className="font-semibold">Đề Thi Luyện Tập</span>
                    </div>
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Ngân Hàng Đề Thi
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                        Lựa chọn đề thi phù hợp để kiểm tra và nâng cao trình độ tiếng Anh của bạn
                    </p>
                </div>

                {/* Filter Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Filter className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Lọc theo loại đề thi</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {Object.entries(examTypeInfo).map(([type, info]) => {
                            const Icon = info.icon;
                            const isSelected = selectedType === type;
                            return (
                                <button
                                    key={type}
                                    onClick={() => setSelectedType(type)}
                                    className={`
                                        flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
                                        transition-all duration-300 transform hover:scale-105
                                        ${isSelected 
                                            ? `bg-gradient-to-r ${info.color} text-white shadow-lg` 
                                            : `${info.bgLight} ${info.textColor} hover:shadow-md`
                                        }
                                    `}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{info.label}</span>
                                    {isSelected && <Sparkles className="w-4 h-4 animate-pulse" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Exam Cards Grid */}
                {exams.length === 0 ? (
                    <div className="text-center py-16">
                        <FileText className="w-20 h-20 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Không có đề thi nào
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Hiện tại chưa có đề thi {examTypeInfo[selectedType]?.label.toLowerCase()}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exams.map((exam) => {
                            const typeInfo = examTypeInfo[exam.type] || examTypeInfo.MOCK_TEST;
                            const Icon = typeInfo.icon;
                            
                            return (
                                <div
                                    key={exam.id}
                                    className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl 
                                             transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
                                >
                                    {/* Card Header với Gradient */}
                                    <div className={`bg-gradient-to-r ${typeInfo.color} p-6 relative overflow-hidden`}>
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-2 text-white/90 text-sm font-medium mb-2">
                                                <Icon className="w-4 h-4" />
                                                <span>{typeInfo.label}</span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-white line-clamp-2 mb-2">
                                                {exam.title}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6">
                                        <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-6 min-h-[4.5rem]">
                                            {exam.description || 'Đề thi luyện tập chất lượng cao'}
                                        </p>

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                                                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span className="text-xs font-medium">Thời gian</span>
                                                </div>
                                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {exam.duration} phút
                                                </p>
                                            </div>
                                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                                                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
                                                    <FileText className="w-4 h-4" />
                                                    <span className="text-xs font-medium">Câu hỏi</span>
                                                </div>
                                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {exam.totalQuestions} câu
                                                </p>
                                            </div>
                                        </div>

                                        {/* Start Button */}
                                        <button
                                            onClick={() => handleStartExam(exam.id)}
                                            className={`
                                                w-full bg-gradient-to-r ${typeInfo.color} 
                                                text-white font-bold py-4 rounded-xl
                                                flex items-center justify-center gap-2
                                                hover:shadow-xl transition-all duration-300
                                                transform group-hover:scale-105
                                            `}
                                        >
                                            <span>Bắt đầu làm bài</span>
                                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamList;
