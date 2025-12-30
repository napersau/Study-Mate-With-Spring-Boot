import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { 
    Plus, 
    Edit, 
    Trash2, 
    Eye,
    CheckCircle,
    X,
    Save,
    BookOpen,
    DollarSign,
    Award
} from 'lucide-react';
import courseService from '../../service/courseService';

const CourseAdmin = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [mode, setMode] = useState('list'); // 'list', 'create', 'edit'
    const [editingCourse, setEditingCourse] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        price: '',
        imageUrl: '',
        level: 'Beginner',
        isPublished: false
    });

    const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await courseService.getAllCourses();
            if (response.code === 1000) {
                setCourses(response.result);
            }
        } catch (err) {
            console.error('Error fetching courses:', err);
            setError('Không thể tải danh sách khóa học');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleEditorChange = (content) => {
        setFormData(prev => ({ ...prev, content }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.title.trim()) {
            setError('Tiêu đề không được để trống');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const courseData = {
                title: formData.title,
                description: formData.description,
                price: formData.price ? parseFloat(formData.price) : null,
                level: formData.level
            };

            let response;
            if (mode === 'edit' && editingCourse) {
                response = await courseService.updateCourse(editingCourse.id, courseData);
                setSuccess('Cập nhật khóa học thành công!');
            } else {
                response = await courseService.createCourse(courseData);
                setSuccess('Tạo khóa học mới thành công!');
            }

            if (response.code === 1000) {
                resetForm();
                setMode('list');
                fetchCourses();
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (err) {
            console.error('Error saving course:', err);
            setError('Có lỗi xảy ra khi lưu khóa học');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        setFormData({
            title: course.title,
            description: course.description || '',
            content: course.content || '',
            price: course.price || '',
            imageUrl: course.imageUrl || '',
            level: course.level,
            isPublished: course.isPublished
        });
        setMode('edit');
    };

    const handleDelete = async (courseId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
            return;
        }

        try {
            setLoading(true);
            await courseService.deleteCourse(courseId);
            setSuccess('Xóa khóa học thành công!');
            fetchCourses();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Error deleting course:', err);
            setError('Có lỗi xảy ra khi xóa khóa học');
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async (courseId) => {
        try {
            setLoading(true);
            const response = await courseService.publishCourse(courseId);
            if (response.code === 1000) {
                setSuccess('Xuất bản khóa học thành công!');
                fetchCourses();
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (err) {
            console.error('Error publishing course:', err);
            setError('Có lỗi xảy ra khi xuất bản khóa học');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            content: '',
            price: '',
            imageUrl: '',
            level: 'Beginner',
            isPublished: false
        });
        setEditingCourse(null);
        setError(null);
    };

    const handleCancel = () => {
        resetForm();
        setMode('list');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl">
                                <BookOpen className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    Quản Lý Khóa Học
                                </h1>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {mode === 'list' ? 'Danh sách khóa học' : mode === 'edit' ? 'Chỉnh sửa khóa học' : 'Tạo khóa học mới'}
                                </p>
                            </div>
                        </div>
                        
                        {mode === 'list' && (
                            <button
                                onClick={() => setMode('create')}
                                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                            >
                                <Plus className="w-5 h-5" />
                                Tạo khóa học mới
                            </button>
                        )}
                    </div>
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-lg mb-6">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* List Mode */}
                {mode === 'list' && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                        <div className="grid gap-6">
                            {courses.length === 0 ? (
                                <div className="text-center py-12">
                                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 dark:text-gray-400">Chưa có khóa học nào</p>
                                </div>
                            ) : (
                                courses.map((course) => (
                                    <div 
                                        key={course.id}
                                        className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-l-4 border-purple-600"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                                        {course.title}
                                                    </h3>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                        course.isPublished 
                                                            ? 'bg-green-500 text-white' 
                                                            : 'bg-gray-500 text-white'
                                                    }`}>
                                                        {course.isPublished ? 'Đã xuất bản' : 'Nháp'}
                                                    </span>
                                                </div>
                                                <p className="text-gray-700 dark:text-gray-300 mb-4">
                                                    {course.description}
                                                </p>
                                                <div className="flex flex-wrap gap-4 text-sm">
                                                    <span className="flex items-center gap-2 bg-white dark:bg-gray-600 px-4 py-2 rounded-lg">
                                                        <Award className="w-4 h-4 text-purple-600" />
                                                        <span className="font-semibold">{course.level}</span>
                                                    </span>
                                                    <span className="flex items-center gap-2 bg-white dark:bg-gray-600 px-4 py-2 rounded-lg">
                                                        <DollarSign className="w-4 h-4 text-green-600" />
                                                        <span className="font-semibold">
                                                            {course.price ? `${course.price.toLocaleString()}đ` : 'Miễn phí'}
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 ml-4">
                                                {!course.isPublished && (
                                                    <button
                                                        onClick={() => handlePublish(course.id)}
                                                        className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                                        title="Xuất bản"
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleEdit(course)}
                                                    className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(course.id)}
                                                    className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                    title="Xóa"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Create/Edit Form */}
                {(mode === 'create' || mode === 'edit') && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                        <form onSubmit={handleSubmit}>
                            {/* Title */}
                            <div className="mb-6">
                                <label className="block text-gray-900 dark:text-white font-semibold mb-2">
                                    Tiêu đề khóa học <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-600 focus:outline-none"
                                    placeholder="VD: Khóa học IELTS cho người mới bắt đầu"
                                    maxLength={255}
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <label className="block text-gray-900 dark:text-white font-semibold mb-2">
                                    Mô tả ngắn
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-600 focus:outline-none"
                                    placeholder="Mô tả ngắn gọn về khóa học..."
                                    maxLength={500}
                                />
                            </div>

                            {/* Price and Level */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-gray-900 dark:text-white font-semibold mb-2">
                                        Giá khóa học (VNĐ)
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-600 focus:outline-none"
                                        placeholder="0 = Miễn phí"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-900 dark:text-white font-semibold mb-2">
                                        Trình độ
                                    </label>
                                    <select
                                        name="level"
                                        value={formData.level}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-600 focus:outline-none"
                                    >
                                        {levels.map(level => (
                                            <option key={level} value={level}>{level}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Image URL */}
                            <div className="mb-6">
                                <label className="block text-gray-900 dark:text-white font-semibold mb-2">
                                    URL hình ảnh
                                </label>
                                <input
                                    type="url"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-600 focus:outline-none"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            {/* Content Editor */}
                            <div className="mb-6">
                                <label className="block text-gray-900 dark:text-white font-semibold mb-2">
                                    Nội dung chi tiết
                                </label>
                                <Editor
                                    apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
                                    value={formData.content}
                                    onEditorChange={handleEditorChange}
                                    init={{
                                        height: 500,
                                        menubar: true,
                                        plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                        ],
                                        toolbar: 'undo redo | blocks | ' +
                                            'bold italic forecolor | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                            'removeformat | help',
                                    }}
                                />
                            </div>

                            {/* Published Checkbox */}
                            <div className="mb-6">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isPublished"
                                        checked={formData.isPublished}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 text-purple-600"
                                    />
                                    <span className="text-gray-900 dark:text-white font-semibold">
                                        Xuất bản khóa học ngay
                                    </span>
                                </label>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                                >
                                    <Save className="w-5 h-5" />
                                    {loading ? 'Đang lưu...' : mode === 'edit' ? 'Cập nhật' : 'Tạo khóa học'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex items-center justify-center gap-2 bg-gray-500 text-white font-bold px-8 py-4 rounded-xl hover:bg-gray-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseAdmin;
