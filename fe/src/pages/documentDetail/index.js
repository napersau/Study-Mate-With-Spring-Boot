import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Eye } from 'lucide-react';

const DocumentDetail = () => {
    const { category, documentId } = useParams();
    const navigate = useNavigate();
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);

    // TODO: Implement API call to get document detail by ID
    // For now, using placeholder data
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setDocument({
                id: documentId,
                title: 'Sample Document',
                content: '<h1>Sample Content</h1><p>This is sample content.</p>',
                createdAt: new Date().toISOString(),
                viewCount: 100
            });
            setLoading(false);
        }, 500);
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

                    {/* Content Section với typography đẹp */}
                    <div className="p-10 md:p-14">
                        <div 
                            className="prose prose-lg dark:prose-invert max-w-none
                                prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
                                prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                                prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
                                prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                                prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-bold
                                prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-700 prose-code:px-2 prose-code:py-1 prose-code:rounded
                                prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:shadow-xl
                                prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r
                                prose-ul:list-disc prose-ol:list-decimal
                                prose-li:text-gray-700 dark:prose-li:text-gray-300
                                prose-img:rounded-xl prose-img:shadow-lg
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
