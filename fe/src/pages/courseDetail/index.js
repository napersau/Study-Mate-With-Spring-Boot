import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, 
    BookOpen, 
    Users,
    DollarSign,
    CheckCircle,
    PlayCircle,
    FileText,
    ShoppingCart,
    Loader2,
    Lock,
    Video,
    Clock,
    ChevronDown,
    ChevronUp,
    Layers,
    ClipboardList,
    Unlock,
} from 'lucide-react';
import useStudyTimer from '../../hooks/useStudyTimer';
import useCourseDetail from './useCourseDetail';

// Map lesson type → icon + label
const LESSON_TYPE_META = {
    VIDEO:      { icon: Video,         label: 'Video' },
    DOCUMENT:   { icon: FileText,      label: 'Tài liệu' },
    FLASHCARD:  { icon: Layers,        label: 'Flashcard' },
    EXAM:       { icon: ClipboardList, label: 'Bài kiểm tra' },
};

const getLessonMeta = (type) =>
    LESSON_TYPE_META[type] || { icon: BookOpen, label: type || 'Bài học' };

const formatDuration = (seconds) => {
    if (!seconds) return null;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}p ${s > 0 ? s + 'g' : ''}`.trim() : `${s}g`;
};

const CourseDetail = () => {
    const navigate = useNavigate();
    const [openSections, setOpenSections] = useState({});

    const toggleSection = (id) =>
        setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));

    // Tự động đếm thời gian học khóa học, gửi lên server khi rời trang
    useStudyTimer();

    const {
        course,
        loading,
        error,
        paying,
        payError,
        isFree,
        isEnrolled,
        handlePayVnPay,
    } = useCourseDetail();

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

                    {/* Enroll / Pay Button Section */}
                    <div className="p-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800">
                        {payError && (
                            <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-4 py-3 rounded-lg text-sm font-medium">
                                {payError}
                            </div>
                        )}

                        {isEnrolled ? (
                            /* Đã sở hữu → Truy cập khóa học */
                            <div className="space-y-3">
                                <div className="flex items-center justify-center gap-2 mb-3">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <span className="text-green-600 dark:text-green-400 font-semibold text-sm">
                                        Bạn đã sở hữu khóa học này
                                    </span>
                                </div>
                                <button
                                    onClick={() => navigate(`/courses/${course.id}/learn`)}
                                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg py-4 rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                                >
                                    <PlayCircle className="w-6 h-6" />
                                    <span>Truy cập khóa học</span>
                                </button>
                            </div>
                        ) : isFree ? (
                            /* Miễn phí → Đăng ký ngay */
                            <button
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg py-4 rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                            >
                                <PlayCircle className="w-6 h-6" />
                                <span>Đăng ký miễn phí ngay</span>
                            </button>
                        ) : (
                            /* Có phí → Thanh toán VNPay */
                            <div className="space-y-3">
                                <button
                                    onClick={handlePayVnPay}
                                    disabled={paying}
                                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg py-4 rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {paying ? (
                                        <>
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                            <span>Đang kết nối VNPay...</span>
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="w-6 h-6" />
                                            <span>
                                                Mua khóa học &nbsp;—&nbsp;
                                                {course.price?.toLocaleString('vi-VN')}đ
                                            </span>
                                        </>
                                    )}
                                </button>
                                <p className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                    <Lock className="w-3 h-3" />
                                    Thanh toán an toàn qua cổng VNPay
                                </p>
                            </div>
                        )}
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

                {/* Sections & Lessons List */}
                {course.sections && course.sections.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                            <FileText className="w-8 h-8 text-purple-600" />
                            Chương trình học
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                            {course.sections.length} phần &bull;&nbsp;
                            {course.sections.reduce((sum, s) => sum + (s.lessons?.length || 0), 0)} bài học
                        </p>

                        <div className="space-y-3">
                            {course.sections
                                .slice()
                                .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
                                .map((section, index) => {
                                    const isOpen = !!openSections[section.id];
                                    const lessons = section.lessons
                                        ? [...section.lessons].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
                                        : [];

                                    return (
                                        <div
                                            key={section.id}
                                            className="border border-purple-100 dark:border-gray-700 rounded-xl overflow-hidden"
                                        >
                                            {/* Section header — clickable to toggle */}
                                            <button
                                                onClick={() => toggleSection(section.id)}
                                                className="w-full flex items-center gap-4 p-5 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 hover:from-purple-100 hover:to-pink-100 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all duration-200 text-left"
                                            >
                                                <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-gray-900 dark:text-white text-base leading-tight">
                                                        {section.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                        {lessons.length} bài học
                                                    </p>
                                                </div>
                                                {isOpen
                                                    ? <ChevronUp className="w-5 h-5 text-purple-500 flex-shrink-0" />
                                                    : <ChevronDown className="w-5 h-5 text-purple-500 flex-shrink-0" />}
                                            </button>

                                            {/* Lessons list */}
                                            {isOpen && (
                                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                                    {lessons.length === 0 ? (
                                                        <p className="px-6 py-4 text-sm text-gray-400 dark:text-gray-500 italic">
                                                            Chưa có bài học nào trong phần này.
                                                        </p>
                                                    ) : (
                                                        lessons.map((lesson) => {
                                                            const canAccess = isEnrolled || lesson.isFree;
                                                            const meta = getLessonMeta(lesson.type);
                                                            const Icon = meta.icon;
                                                            const dur = formatDuration(lesson.duration);

                                                            return (
                                                                <div
                                                                    key={lesson.id}
                                                                    className={`flex items-center gap-4 px-6 py-4 transition-colors duration-150 ${
                                                                        canAccess
                                                                            ? 'hover:bg-purple-50 dark:hover:bg-gray-750 cursor-pointer'
                                                                            : 'opacity-60 cursor-not-allowed'
                                                                    }`}
                                                                >
                                                                    {/* Type icon */}
                                                                    <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
                                                                        canAccess
                                                                            ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400'
                                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                                                                    }`}>
                                                                        <Icon className="w-4 h-4" />
                                                                    </div>

                                                                    {/* Title + meta */}
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="font-medium text-gray-900 dark:text-white truncate text-sm">
                                                                            {lesson.title}
                                                                        </p>
                                                                        <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                                                            <span>{meta.label}</span>
                                                                            {dur && (
                                                                                <>
                                                                                    <span>·</span>
                                                                                    <span className="flex items-center gap-1">
                                                                                        <Clock className="w-3 h-3" />{dur}
                                                                                    </span>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {/* Free / Lock badge */}
                                                                    {lesson.isFree ? (
                                                                        <span className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                                                                            <Unlock className="w-3 h-3" />Miễn phí
                                                                        </span>
                                                                    ) : !isEnrolled ? (
                                                                        <Lock className="flex-shrink-0 w-4 h-4 text-gray-400" />
                                                                    ) : null}
                                                                </div>
                                                            );
                                                        })
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseDetail;
