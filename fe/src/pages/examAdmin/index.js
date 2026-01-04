import React from 'react';
import { Plus, Edit2, Trash2, Clock, FileText, CheckSquare, X } from 'lucide-react';
import useExamAdminHook from './useExamAdminHook';

const ExamAdmin = () => {
    const {
        mode,
        exams,
        availableQuestionGroups,
        loading,
        error,
        success,
        formData,
        examTypes,
        handleInputChange,
        handleQuestionGroupToggle,
        handleCreate,
        handleEdit,
        handleSubmit,
        handleDelete,
        handleCancel,
    } = useExamAdminHook();

    // Get exam type label
    const getExamTypeLabel = (type) => {
        const examType = examTypes.find(t => t.value === type);
        return examType ? examType.label : type;
    };

    // Get exam type badge color
    const getExamTypeBadgeColor = (type) => {
        const colors = {
            'READING': 'bg-blue-100 text-blue-800',
            'LISTENING': 'bg-purple-100 text-purple-800',
            'WRITING': 'bg-green-100 text-green-800',
            'SPEAKING': 'bg-orange-100 text-orange-800',
            'FULL_TEST': 'bg-red-100 text-red-800',
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    // LIST MODE
    if (mode === 'list') {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quản lý Đề thi</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Tổng số: {exams.length} đề thi
                        </p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Tạo đề thi mới
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center gap-2">
                        <X className="w-5 h-5" />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center gap-2">
                        <CheckSquare className="w-5 h-5" />
                        {success}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : exams.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            Chưa có đề thi nào. Hãy tạo đề thi đầu tiên!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exams.map((exam) => (
                            <div
                                key={exam.id}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow p-6"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getExamTypeBadgeColor(exam.examType)}`}>
                                        {getExamTypeLabel(exam.examType)}
                                    </span>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Clock className="w-4 h-4" />
                                        {exam.duration} phút
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {exam.title}
                                </h3>
                                
                                {exam.description && (
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                        {exam.description}
                                    </p>
                                )}

                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    <FileText className="w-4 h-4" />
                                    {exam.questionGroups?.length || 0} Part(s)
                                </div>

                                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={() => handleEdit(exam)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDelete(exam.id)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // CREATE / EDIT MODE
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {mode === 'create' ? 'Tạo đề thi mới' : 'Chỉnh sửa đề thi'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Điền thông tin và chọn các part cho đề thi
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center gap-2">
                        <X className="w-5 h-5" />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center gap-2">
                        <CheckSquare className="w-5 h-5" />
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Tiêu đề <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="Nhập tiêu đề đề thi..."
                            required
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Mô tả
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Nhập mô tả cho đề thi..."
                            rows="3"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                        />
                    </div>

                    {/* Exam Type and Duration */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Loại đề thi <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.examType}
                                onChange={(e) => handleInputChange('examType', e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            >
                                {examTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Thời gian (phút) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={formData.duration}
                                onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                                min="1"
                                required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Question Groups Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Chọn các Part (Question Groups)
                        </label>
                        
                        {availableQuestionGroups.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600 dark:text-gray-400">
                                    Không có Part nào khả dụng cho loại đề thi này
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                {availableQuestionGroups.map((group) => (
                                    <label
                                        key={group.id}
                                        className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                            formData.questionGroupIds.includes(group.id)
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.questionGroupIds.includes(group.id)}
                                            onChange={() => handleQuestionGroupToggle(group.id)}
                                            className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                        />
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-900 dark:text-white">
                                                {group.name || `Part ${group.id}`}
                                            </div>
                                            {group.description && (
                                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    {group.description}
                                                </div>
                                            )}
                                            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                {group.questions?.length || 0} câu hỏi
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}

                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Đã chọn: {formData.questionGroupIds.length} part(s)
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Đang xử lý...</span>
                                </>
                            ) : (
                                <>
                                    <CheckSquare className="w-5 h-5" />
                                    {mode === 'create' ? 'Tạo đề thi' : 'Cập nhật'}
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={loading}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                            <X className="w-5 h-5" />
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExamAdmin;
