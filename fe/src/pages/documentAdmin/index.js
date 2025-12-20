import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Save, Eye, FileText, Plus, ArrowLeft, Calendar, Trash2, Edit } from 'lucide-react';
import useDocumentAdminHook from './useDocumentAdminHook';
import { BookOpen, GraduationCap, Lightbulb } from 'lucide-react';

const DocumentAdmin = () => {
    const {
        formData,
        setFormData,
        loading,
        error,
        success,
        handleSubmit,
        documents,
        selectedCategory,
        setSelectedCategory
    } = useDocumentAdminHook();

    const [showForm, setShowForm] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const categories = [
        { value: 'GRAMMAR', label: 'Ngữ pháp', icon: BookOpen, gradient: 'from-blue-500 to-cyan-500' },
        { value: 'VOCABULARY', label: 'Từ vựng', icon: FileText, gradient: 'from-green-500 to-emerald-500' },
        { value: 'SKILLS', label: 'Kỹ năng', icon: Lightbulb, gradient: 'from-purple-500 to-pink-500' },
        { value: 'EXAM_PREPARATION', label: 'Luyện thi', icon: GraduationCap, gradient: 'from-red-500 to-rose-500' }
    ];

    const handleEditorChange = (content) => {
        setFormData({ ...formData, content });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        handleSubmit();
        setShowForm(false);
    };

    const handleNewDocument = () => {
        setFormData({
            title: '',
            description: '',
            thumbnail: '',
            content: '',
            category: selectedCategory || '',
            isPublished: false
        });
        setShowForm(true);
        setShowPreview(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Nếu đang ở chế độ form
    if (showForm) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="container mx-auto px-4 py-8 max-w-6xl">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setShowForm(false)}
                                className="group flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all"
                            >
                                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                            </button>
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
                                    {formData.id ? 'Chỉnh sửa tài liệu' : 'Tạo tài liệu mới'}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 text-lg">
                                    Soạn thảo nội dung tài liệu học tập
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="group flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                            {showPreview ? (
                                <>
                                    <FileText className="w-5 h-5 mr-2 transition-transform group-hover:rotate-12" />
                                    <span className="font-semibold">Chỉnh sửa</span>
                                </>
                            ) : (
                                <>
                                    <Eye className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                                    <span className="font-semibold">Xem trước</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 px-6 py-4 rounded-lg mb-6 shadow-md">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">{error}</span>
                            </div>
                        </div>
                    )}

                    {/* Success Alert */}
                    {success && (
                        <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-400 px-6 py-4 rounded-lg mb-6 shadow-md">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">{success}</span>
                            </div>
                        </div>
                    )}

                    {showPreview ? (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                                <h2 className="text-3xl font-bold mb-3">
                                    {formData.title || 'Tiêu đề tài liệu'}
                                </h2>
                                {formData.description && (
                                    <p className="text-blue-100 text-lg">
                                        {formData.description}
                                    </p>
                                )}
                            </div>
                            <div className="p-8 md:p-12">
                                <div 
                                    className="prose prose-lg dark:prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{ __html: formData.content }}
                                />
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={onSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-10">
                            <div className="space-y-8">
                                {/* Title */}
                                <div className="group">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded mr-2 text-xs">*</span>
                                        Tiêu đề
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300 group-hover:border-blue-400"
                                        placeholder="Nhập tiêu đề tài liệu"
                                        required
                                        maxLength={255}
                                    />
                                </div>

                                {/* Description */}
                                <div className="group">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                                        Mô tả ngắn
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-5 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300 group-hover:border-blue-400 resize-none"
                                        placeholder="Nhập mô tả ngắn về tài liệu"
                                        maxLength={500}
                                    />
                                </div>

                                {/* Thumbnail URL */}
                                <div className="group">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                                        URL hình ảnh
                                    </label>
                                    <input
                                        type="text"
                                        name="thumbnail"
                                        value={formData.thumbnail}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300 group-hover:border-blue-400"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>

                                {/* Category */}
                                <div className="group">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded mr-2 text-xs">*</span>
                                        Danh mục
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300 group-hover:border-blue-400"
                                        required
                                    >
                                        <option value="">Chọn danh mục</option>
                                        {categories.map(cat => (
                                            <option key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Content Editor */}
                                <div className="group">
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded mr-2 text-xs">*</span>
                                        Nội dung
                                    </label>
                                    <div className="border-2 border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
                                        <Editor
                                            apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
                                            value={formData.content}
                                            init={{
                                                height: 500,
                                                menubar: true,
                                                plugins: [
                                                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                    'insertdatetime', 'media', 'table', 'help', 'wordcount'
                                                ],
                                                toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                            }}
                                            onEditorChange={handleEditorChange}
                                        />
                                    </div>
                                </div>

                                {/* Published checkbox */}
                                <div className="flex items-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-5 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                                    <input
                                        type="checkbox"
                                        name="isPublished"
                                        id="isPublished"
                                        checked={formData.isPublished}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                    />
                                    <label htmlFor="isPublished" className="ml-3 text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                                        Xuất bản ngay (bỏ chọn để lưu nháp)
                                    </label>
                                </div>

                                {/* Submit button */}
                                <div className="flex justify-end space-x-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="group flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transform hover:scale-105"
                                    >
                                        <Save className="w-5 h-5 mr-2 transition-transform group-hover:rotate-12" />
                                        <span className="font-bold text-lg">
                                            {loading ? 'Đang lưu...' : (formData.isPublished ? 'Xuất bản' : 'Lưu nháp')}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        );
    }

    // View danh sách tài liệu theo danh mục
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
                        Quản lý Tài liệu
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Chọn danh mục để xem và quản lý tài liệu
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        const isSelected = selectedCategory === category.value;
                        const categoryDocs = documents.filter(doc => doc.category === category.value);
                        
                        return (
                            <div
                                key={category.value}
                                onClick={() => setSelectedCategory(isSelected ? null : category.value)}
                                className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden transform hover:-translate-y-2 ${
                                    isSelected ? 'ring-4 ring-blue-500' : ''
                                }`}
                            >
                                <div className="relative bg-white dark:bg-gray-800 p-6">
                                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${category.gradient} shadow-lg mb-4`}>
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                        {category.label}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {categoryDocs.length} tài liệu
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Documents List */}
                {selectedCategory && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                {categories.find(c => c.value === selectedCategory)?.label}
                            </h2>
                            <button
                                onClick={handleNewDocument}
                                className="group flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                <span className="font-semibold">Tạo tài liệu mới</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {documents
                                .filter(doc => doc.category === selectedCategory)
                                .map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="group flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                                                {doc.title}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-1" />
                                                    {formatDate(doc.createdAt)}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    doc.isPublished 
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                }`}>
                                                    {doc.isPublished ? 'Đã xuất bản' : 'Nháp'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setFormData(doc);
                                                    setShowForm(true);
                                                }}
                                                className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                            {documents.filter(doc => doc.category === selectedCategory).length === 0 && (
                                <div className="text-center py-12">
                                    <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        Chưa có tài liệu nào trong danh mục này
                                    </p>
                                    <button
                                        onClick={handleNewDocument}
                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-lg transition-all"
                                    >
                                        <Plus className="w-5 h-5 mr-2" />
                                        Tạo tài liệu đầu tiên
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {!selectedCategory && (
                    <div className="text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            👆 Chọn một danh mục ở trên để bắt đầu quản lý tài liệu
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentAdmin;
