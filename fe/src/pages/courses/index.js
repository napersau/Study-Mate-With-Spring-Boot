import React from 'react';
import { 
    BookOpen, 
    Users, 
    TrendingUp,
    Award,
    Sparkles,
    DollarSign,
    Clock,
    ChevronRight
} from 'lucide-react';
import useCoursesHook, { levelInfo } from './useCoursesHook';

const Courses = () => {
    const {
        loading,
        error,
        selectedLevel,
        setSelectedLevel,
        filteredCourses,
        handleViewCourse,
    } = useCoursesHook();

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
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg">
                    <p className="font-semibold">Lỗi: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full mb-4 shadow-lg">
                        <Sparkles className="w-5 h-5" />
                        <span className="font-semibold">Khóa Học Chất Lượng</span>
                    </div>
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Khám Phá Khóa Học
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                        Nâng cao kỹ năng tiếng Anh của bạn với các khóa học được thiết kế bài bản
                    </p>
                </div>

                {/* Filter Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Lọc theo trình độ</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {Object.entries(levelInfo).map(([level, info]) => {
                            const isSelected = selectedLevel === level;
                            return (
                                <button
                                    key={level}
                                    onClick={() => setSelectedLevel(level)}
                                    className={`
                                        flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
                                        transition-all duration-300 transform hover:scale-105
                                        ${isSelected 
                                            ? `bg-gradient-to-r ${info.color} text-white shadow-lg` 
                                            : `${info.bgLight} ${info.textColor} hover:shadow-md`
                                        }
                                    `}
                                >
                                    <Award className="w-5 h-5" />
                                    <span>{info.label}</span>
                                    {isSelected && <Sparkles className="w-4 h-4 animate-pulse" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Course Cards Grid */}
                {filteredCourses.length === 0 ? (
                    <div className="text-center py-16">
                        <BookOpen className="w-20 h-20 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Không có khóa học nào
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Hiện tại chưa có khóa học {levelInfo[selectedLevel]?.label.toLowerCase()}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course) => {
                            const levelColor = levelInfo[course.level] || levelInfo.Beginner;
                            
                            return (
                                <div
                                    key={course.id}
                                    className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl 
                                             transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
                                >
                                    {/* Course Image/Thumbnail */}
                                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400">
                                        {course.imageUrl ? (
                                            <img 
                                                src={course.imageUrl} 
                                                alt={course.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <BookOpen className="w-20 h-20 text-white/60" />
                                            </div>
                                        )}
                                        {/* Level Badge */}
                                        <div className={`absolute top-4 right-4 bg-gradient-to-r ${levelColor.color} text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg`}>
                                            {levelInfo[course.level]?.label || course.level}
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 min-h-[3.5rem]">
                                            {course.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-6 min-h-[4.5rem]">
                                            {course.description || 'Khóa học chất lượng cao giúp bạn nâng cao kỹ năng tiếng Anh'}
                                        </p>

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                                                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
                                                    <Users className="w-4 h-4" />
                                                    <span className="text-xs font-medium">Học viên</span>
                                                </div>
                                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {course.totalStudents || 0}
                                                </p>
                                            </div>
                                            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                                                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-1">
                                                    <DollarSign className="w-4 h-4" />
                                                    <span className="text-xs font-medium">Giá</span>
                                                </div>
                                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {course.price ? `${course.price.toLocaleString()}đ` : 'Miễn phí'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* View Button */}
                                        <button
                                            onClick={() => handleViewCourse(course.id)}
                                            className={`
                                                w-full bg-gradient-to-r ${levelColor.color}
                                                text-white font-bold py-4 rounded-xl
                                                flex items-center justify-center gap-2
                                                hover:shadow-xl transition-all duration-300
                                                transform group-hover:scale-105
                                            `}
                                        >
                                            <span>Xem chi tiết</span>
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

export default Courses;
