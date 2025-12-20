import { useState, useEffect } from 'react';
import documentService from '../../service/documentService';

const useDocumentAdminHook = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        thumbnail: '',
        content: '',
        category: '',
        isPublished: false
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Fetch documents khi chọn category
    useEffect(() => {
        if (selectedCategory) {
            fetchDocumentsByCategory(selectedCategory);
        }
    }, [selectedCategory]);

    const fetchDocumentsByCategory = async (category) => {
        try {
            const response = await documentService.getDocumentsByCategory(category);
            if (response.code === 1000) {
                setDocuments(response.result);
            }
        } catch (err) {
            console.error('Error fetching documents:', err);
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            // Validate required fields
            if (!formData.title.trim()) {
                setError('Vui lòng nhập tiêu đề');
                return;
            }

            if (!formData.content.trim()) {
                setError('Vui lòng nhập nội dung');
                return;
            }

            if (!formData.category) {
                setError('Vui lòng chọn danh mục');
                return;
            }

            const response = await documentService.createDocument(formData);

            if (response.code === 1000) {
                setSuccess(response.message || 'Tạo tài liệu thành công!');
                // Refresh danh sách
                if (selectedCategory) {
                    fetchDocumentsByCategory(selectedCategory);
                }
                // Reset form
                setFormData({
                    title: '',
                    description: '',
                    thumbnail: '',
                    content: '',
                    category: '',
                    isPublished: false
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi tạo tài liệu');
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        setFormData,
        loading,
        error,
        success,
        handleSubmit,
        documents,
        selectedCategory,
        setSelectedCategory
    };
};

export default useDocumentAdminHook;
