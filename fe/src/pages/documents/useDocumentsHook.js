import { useState, useEffect } from 'react';
import documentService from '../../service/documentService';

const useDocumentsHook = (category) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDocuments();
    }, [category]);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await documentService.getDocumentsByCategory(category);
            if (response.code === 1000) {
                setDocuments(response.result);
            }
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra khi tải tài liệu');
        } finally {
            setLoading(false);
        }
    };

    return { documents, loading, error, refetch: fetchDocuments };
};

export default useDocumentsHook;
