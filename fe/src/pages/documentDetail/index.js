import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Eye } from 'lucide-react';
import documentService from '../../service/documentService';

const DocumentDetail = () => {
    const { category, documentId } = useParams();
    const navigate = useNavigate();
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await documentService.getDocumentById(documentId);
                if (response.code === 1000) {
                    setDocument(response.result);
                } else {
                    setError(response.message || 'Không thể tải tài liệu');
                }
            } catch (err) {
                console.error('Error fetching document:', err);
                setError('Có lỗi xảy ra khi tải tài liệu');
            } finally {
                setLoading(false);
            }
        };

        fetchDocument();
    }, [documentId]);

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
                <button
                    onClick={() => navigate(`/documents/${category}`)}
                    className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Quay lại danh sách
                </button>
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
                    <p className="font-semibold">Lỗi: {error}</p>
                </div>
            </div>
        );
    }

    if (!document) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Không tìm thấy tài liệu
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Back Button */}
                <button
                    onClick={() => navigate(`/documents/${category}`)}
                    className="group flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-8 transition-all duration-300 hover:gap-3 gap-2"
                >
                    <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    <span className="font-medium">Quay lại danh sách</span>
                </button>

                {/* Main Article với shadow đẹp */}
                <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header Section với gradient background */}
                    <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-10 text-white">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative z-10">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                                {document.title}
                            </h1>

                            {/* Meta Info với badge đẹp */}
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span>{formatDate(document.createdAt)}</span>
                                </div>
                                <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <Eye className="w-4 h-4 mr-2" />
                                    <span className="font-semibold">{document.viewCount}</span> lượt xem
                                </div>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
                    </div>

                    {/* Content Section - Nền sáng, text đậm rõ ràng */}
                    <div className="p-10 md:p-14 bg-white dark:bg-gray-900">
                        <div 
                            className="prose prose-lg max-w-none text-gray-900 dark:text-gray-100
                                /* Headings - Text rất rõ */
                                prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
                                prose-h1:text-4xl prose-h1:mb-6 
                                prose-h2:text-3xl prose-h2:mb-5 prose-h2:mt-8 
                                prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-6 
                                prose-h4:text-xl prose-h4:mb-3 
                                
                                /* Paragraphs - Text sáng rõ */
                                prose-p:text-gray-900 dark:prose-p:text-gray-100
                                prose-p:leading-relaxed prose-p:mb-4 prose-p:text-lg
                                
                                /* Links - Màu nổi bật */
                                prose-a:text-blue-600 dark:prose-a:text-blue-300
                                prose-a:font-semibold prose-a:underline hover:prose-a:text-blue-700 dark:hover:prose-a:text-blue-200
                                
                                /* Strong & Bold - Rất đậm */
                                prose-strong:text-gray-900 dark:prose-strong:text-white
                                prose-strong:font-extrabold
                                
                                /* Lists - Text sáng */
                                prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
                                prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
                                prose-li:text-gray-900 dark:prose-li:text-gray-100
                                prose-li:mb-2 prose-li:leading-relaxed prose-li:text-lg
                                
                                /* Tables - Rõ ràng, dễ đọc */
                                prose-table:w-full prose-table:border-collapse prose-table:my-6
                                prose-table:bg-white dark:prose-table:bg-gray-800
                                prose-thead:bg-blue-100 dark:prose-thead:bg-blue-900
                                prose-th:border prose-th:border-gray-400 dark:prose-th:border-gray-500
                                prose-th:px-4 prose-th:py-3 prose-th:text-left 
                                prose-th:font-bold prose-th:text-gray-900 dark:prose-th:text-white
                                prose-th:text-base
                                prose-td:border prose-td:border-gray-400 dark:prose-td:border-gray-500
                                prose-td:px-4 prose-td:py-3 
                                prose-td:text-gray-900 dark:prose-td:text-gray-100
                                prose-td:text-base
                                prose-tr:even:bg-gray-100 dark:prose-tr:even:bg-gray-700/50
                                
                                /* Code - Nổi bật */
                                prose-code:text-pink-700 dark:prose-code:text-pink-300
                                prose-code:bg-pink-100 dark:prose-code:bg-pink-900/30
                                prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono
                                prose-code:font-semibold
                                prose-pre:bg-gray-900 dark:prose-pre:bg-black
                                prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:shadow-xl
                                
                                /* Blockquotes - Rõ ràng */
                                prose-blockquote:border-l-4 prose-blockquote:border-blue-600
                                prose-blockquote:bg-blue-100 dark:prose-blockquote:bg-blue-900/30
                                prose-blockquote:py-3 prose-blockquote:px-4 prose-blockquote:italic
                                prose-blockquote:text-gray-900 dark:prose-blockquote:text-gray-100
                                prose-blockquote:my-4 prose-blockquote:rounded-r
                                
                                /* Images */
                                prose-img:rounded-xl prose-img:shadow-lg prose-img:my-6
                                
                                /* Horizontal Rule */
                                prose-hr:border-gray-400 dark:prose-hr:border-gray-600 prose-hr:my-8
                            "
                            dangerouslySetInnerHTML={{ __html: document.content }}
                        />
                    </div>
                </article>
            </div>
        </div>
    );
};

export default DocumentDetail;
