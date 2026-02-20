import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, 
    BookOpen, 
    Users,
    Award,
    DollarSign,
    Clock,
    CheckCircle,
    PlayCircle,
    FileText
} from 'lucide-react';
import courseService from '../../service/courseService';
import useStudyTimer from '../../hooks/useStudyTimer';

const CourseDetail = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Tự động đếm thời gian học khóa học, gửi lên server khi rời trang
    useStudyTimer();

    useEffect(() => {
        fetchCourseDetail();
    }, [courseId]);

    const fetchCourseDetail = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await courseService.getCourseById(courseId);
            
            if (response.code === 1000) {
                setCourse(response.result);
            } else {
                setError(response.message || 'Không thể tải thông tin khóa học');
            }
        } catch (err) {
            console.error('Error fetching course:', err);
            setError('Có lỗi xảy ra khi tải thông tin khóa học');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">Đang tải khóa học...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <button
                    onClick={() => navigate('/courses')}
                    className="flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 mb-4"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Quay lại danh sách
                </button>
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg">
                    <p className="font-semibold">Lỗi: {error}</p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Không tìm thấy khóa học
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/courses')}
                    className="group flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mb-8 transition-all duration-300 hover:gap-3 gap-2"
                >
                    <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    <span className="font-medium">Quay lại danh sách</span>
                </button>

                {/* Course Header Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden mb-8">
                    {/* Hero Section với Gradient */}
                    <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-10 text-white">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-semibold">
                                    {course.level}
                                </span>
                                {course.isPublished ? (
                                    <span className="bg-green-500/80 backdrop-blur-sm px-4 py-2 rounded-full font-semibold flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        Đang mở
                                    </span>
                                ) : (
                                    <span className="bg-gray-500/80 backdrop-blur-sm px-4 py-2 rounded-full font-semibold">
                                        Chưa mở
                                    </span>
                                )}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                                {course.title}
                            </h1>
                            <p className="text-xl text-white/90 mb-6">
                                {course.description}
                            </p>

                            {/* Stats Bar */}
                            <div className="flex flex-wrap items-center gap-6 text-sm">
                                <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <Users className="w-4 h-4 mr-2" />
                                    <span className="font-semibold">{course.totalStudents || 0}</span> học viên
                                </div>
                                <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <DollarSign className="w-4 h-4 mr-2" />
                                    <span className="font-semibold">
                                        {course.price ? `${course.price.toLocaleString()}đ` : 'Miễn phí'}
                                    </span>
                                </div>
                                {course.sections && (
                                    <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                        <FileText className="w-4 h-4 mr-2" />
                                        <span className="font-semibold">{course.sections.length}</span> phần học
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
                    </div>

                    {/* Enroll Button Section */}
                    <div className="p-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800">
                        <button
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg py-4 rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                        >
                            <PlayCircle className="w-6 h-6" />
                            <span>Đăng ký khóa học ngay</span>
                        </button>
                    </div>
                </div>

                {/* Course Content Section */}
                {course.content && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10 mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                            <BookOpen className="w-8 h-8 text-purple-600" />
                            Nội dung khóa học
                        </h2>
                        <div 
                            className="prose prose-lg max-w-none text-gray-900 dark:text-gray-100
                                prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
                                prose-p:text-gray-900 dark:prose-p:text-gray-100 prose-p:leading-relaxed prose-p:text-lg
                                prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
                                prose-li:text-gray-900 dark:prose-li:text-gray-100 prose-li:mb-2
                                prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-extrabold
                            "
                            dangerouslySetInnerHTML={{ __html: course.content }}
                        />
                    </div>
                )}

                {/* Sections List */}
                {course.sections && course.sections.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                            <FileText className="w-8 h-8 text-purple-600" />
                            Chương trình học
                        </h2>
                        <div className="space-y-4">
                            {course.sections.map((section, index) => (
                                <div 
                                    key={section.id}
                                    className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-l-4 border-purple-600 hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center font-bold">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                                {section.title}
                                            </h3>
                                            {section.description && (
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    {section.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseDetail;
