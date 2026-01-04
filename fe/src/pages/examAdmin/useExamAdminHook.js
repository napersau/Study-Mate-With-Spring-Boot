import { useState, useEffect } from 'react';
import examService from '../../service/examService';

const useExamAdminHook = () => {
    const [mode, setMode] = useState('list'); // 'list', 'create', 'edit'
    const [exams, setExams] = useState([]);
    const [availableQuestionGroups, setAvailableQuestionGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [formData, setFormData] = useState({
        id: null,
        title: '',
        description: '',
        examType: 'READING',
        duration: 60,
        questionGroupIds: [],
    });

    // Exam types options
    const examTypes = [
        { value: 'READING', label: 'Reading' },
        { value: 'LISTENING', label: 'Listening' },
        { value: 'WRITING', label: 'Writing' },
        { value: 'SPEAKING', label: 'Speaking' },
        { value: 'FULL_TEST', label: 'Full Test' },
    ];

    // Load all exams
    const loadExams = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await examService.getAllExams();
            setExams(response.result || response);
        } catch (err) {
            setError('Không thể tải danh sách đề thi');
            console.error('Load exams error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Load available question groups for selected type
    const loadAvailableQuestionGroups = async (type) => {
        try {
            const response = await examService.getAvailableQuestionGroups(type);
            setAvailableQuestionGroups(response.result || response);
        } catch (err) {
            console.error('Load question groups error:', err);
            setAvailableQuestionGroups([]);
        }
    };

    useEffect(() => {
        loadExams();
    }, []);

    // Load question groups when exam type changes in create/edit mode
    useEffect(() => {
        if ((mode === 'create' || mode === 'edit') && formData.examType) {
            loadAvailableQuestionGroups(formData.examType);
        }
    }, [mode, formData.examType]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleQuestionGroupToggle = (groupId) => {
        setFormData(prev => ({
            ...prev,
            questionGroupIds: prev.questionGroupIds.includes(groupId)
                ? prev.questionGroupIds.filter(id => id !== groupId)
                : [...prev.questionGroupIds, groupId]
        }));
    };

    const handleCreate = () => {
        setMode('create');
        setFormData({
            id: null,
            title: '',
            description: '',
            examType: 'READING',
            duration: 60,
            questionGroupIds: [],
        });
        setError(null);
        setSuccess(null);
    };

    const handleEdit = async (exam) => {
        setMode('edit');
        setFormData({
            id: exam.id,
            title: exam.title || '',
            description: exam.description || '',
            examType: exam.examType || 'READING',
            duration: exam.duration || 60,
            questionGroupIds: exam.questionGroups?.map(qg => qg.id) || [],
        });
        setError(null);
        setSuccess(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const submitData = {
                title: formData.title,
                description: formData.description,
                examType: formData.examType,
                duration: formData.duration,
                questionGroupIds: formData.questionGroupIds,
            };

            if (mode === 'create') {
                await examService.createExam(submitData);
                setSuccess('Tạo đề thi thành công!');
            } else if (mode === 'edit') {
                await examService.updateExam(formData.id, submitData);
                setSuccess('Cập nhật đề thi thành công!');
            }

            await loadExams();
            setTimeout(() => {
                setMode('list');
                setSuccess(null);
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
            console.error('Submit error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa đề thi này?')) {
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await examService.deleteExam(id);
            setSuccess('Xóa đề thi thành công!');
            await loadExams();
            setTimeout(() => setSuccess(null), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể xóa đề thi');
            console.error('Delete error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setMode('list');
        setFormData({
            id: null,
            title: '',
            description: '',
            examType: 'READING',
            duration: 60,
            questionGroupIds: [],
        });
        setError(null);
        setSuccess(null);
    };

    return {
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
    };
};

export default useExamAdminHook;
