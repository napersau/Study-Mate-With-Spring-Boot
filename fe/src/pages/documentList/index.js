import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Eye, FileText } from 'lucide-react';
import useDocumentsHook from '../documents/useDocumentsHook';

const DocumentList = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    const { documents, loading, error } = useDocumentsHook(category);

    const categoryNames = {
        'PROGRAMMING': 'Lập trình',
        'DATABASE': 'Cơ sở dữ liệu',
        'ALGORITHM': 'Thuật toán',
        'THEORY': 'Lý thuyết',
        'TUTORIAL': 'Hướng dẫn',
        'OTHER': 'Khác'
    };

    const handleDocumentClick = (documentId) => {
        navigate(`/documents/${category}/${documentId}`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8">
                {/* Back Button với hiệu ứng */}
                <button
                    onClick={() => navigate('/documents')}
                    className="group flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-8 transition-all duration-300 hover:gap-3 gap-2"
                >
                    <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    <span className="font-medium">Quay lại danh mục</span>
                </button>

                {/* Header với gradient */}
                <div className="mb-10">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-3">
                        {categoryNames[category] || category}
                    </h1>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3"></div>
                        <p className="text-lg">
                            <span className="font-semibold text-blue-600 dark:text-blue-400">{documents.length}</span> tài liệu
                        </p>
                    </div>
                </div>

                {documents.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                        <div className="bg-gray-100 dark:bg-gray-700 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FileText className="w-12 h-12 text-gray-400" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-xl font-medium">
                            Chưa có tài liệu nào trong danh mục này
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {documents.map((document, index) => (
                            <div
                                key={document.id}
                                onClick={() => handleDocumentClick(document.id)}
                                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden transform hover:-translate-y-2"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Thumbnail với overlay gradient */}
                                {document.thumbnail ? (
                                    <div className="relative overflow-hidden h-52">
                                        <img
                                            src={document.thumbnail}
                                            alt={document.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    </div>
                                ) : (
                                    <div className="h-52 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                        <FileText className="w-16 h-16 text-white opacity-50" />
                                    </div>
                                )}

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {document.title}
                                    </h3>
                                    {document.description && (
                                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                                            {document.description}
                                        </p>
                                    )}

                                    {/* Divider */}
                                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent mb-4"></div>

                                    {/* Meta Info */}
                                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full">
                                            <Calendar className="w-4 h-4" />
                                            <span>{formatDate(document.createdAt)}</span>
                                        </div>
                                        <div className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full">
                                            <Eye className="w-4 h-4" />
                                            <span className="font-semibold">{document.viewCount}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentList;
