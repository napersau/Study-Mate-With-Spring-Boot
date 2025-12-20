import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Save, Eye, FileText } from 'lucide-react';
import useDocumentAdminHook from './useDocumentAdminHook';

const DocumentAdmin = () => {
    const {
        formData,
        setFormData,
        loading,
        error,
        success,
        handleSubmit
    } = useDocumentAdminHook();

    const [showPreview, setShowPreview] = useState(false);

    const categories = [
        { value: 'PROGRAMMING', label: 'Lập trình' },
        { value: 'DATABASE', label: 'Cơ sở dữ liệu' },
        { value: 'ALGORITHM', label: 'Thuật toán' },
        { value: 'THEORY', label: 'Lý thuyết' },
        { value: 'TUTORIAL', label: 'Hướng dẫn' },
        { value: 'OTHER', label: 'Khác' }
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
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header với gradient */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
                            Quản lý tài liệu
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            Tạo và quản lý tài liệu học tập một cách dễ dàng
                        </p>
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

            {/* Error Alert với animation */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 px-6 py-4 rounded-lg mb-6 shadow-md animate-fade-in">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{error}</span>
                    </div>
                </div>
            )}

            {/* Success Alert với animation */}
            {success && (
                <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-400 px-6 py-4 rounded-lg mb-6 shadow-md animate-fade-in">
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
                            <div className="border-2 border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden group-hover:border-blue-400 transition-colors">
                                <Editor
                                    apiKey="your-tinymce-api-key"
                                    value={formData.content}
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
                                            'removeformat | help | code | image link',
                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                    }}
                                    onEditorChange={handleEditorChange}
                                />
                            </div>
                        </div>

                        {/* Published checkbox với design đẹp */}
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

                        {/* Submit button với gradient và animation */}
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
    );
};

export default DocumentAdmin;
