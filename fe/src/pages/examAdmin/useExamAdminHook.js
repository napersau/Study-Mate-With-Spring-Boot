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
        examType: 'TOEIC_FULL_TEST',
        duration: 120,
        questionGroupIds: [],
    });

    // Exam types options
    const examTypes = [
        { value: 'TOEIC_FULL_TEST', label: 'TOEIC Full Test (200 câu)', duration: 120 },
        { value: 'TOEIC_MINI_TEST', label: 'TOEIC Mini Test (50-100 câu)', duration: 60 },
        { value: 'IELTS_ACADEMIC', label: 'IELTS Academic', duration: 180 },
        { value: 'IELTS_GENERAL', label: 'IELTS General Training', duration: 180 },
        { value: 'MOCK_TEST', label: 'Mock Test / Bài kiểm tra', duration: 45 },
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

    // Load available question groups (ALL parts chưa có exam)
    const loadAvailableQuestionGroups = async () => {
        console.log('Loading all available question groups...');
        try {
            const response = await examService.getAvailableQuestionGroups();
            console.log('Question groups response:', response);
            const groups = response.result || response;
            console.log('Available question groups:', groups);
            setAvailableQuestionGroups(groups);
        } catch (err) {
            console.error('Load question groups error:', err);
            setAvailableQuestionGroups([]);
        }
    };

    useEffect(() => {
        loadExams();
    }, []);

    // Load question groups when entering create/edit mode
    useEffect(() => {
        if (mode === 'create' || mode === 'edit') {
            loadAvailableQuestionGroups();
        }
    }, [mode]);

    const handleInputChange = (field, value) => {
        if (field === 'examType') {
            // Auto-set duration based on exam type
            const selectedType = examTypes.find(t => t.value === value);
            setFormData(prev => ({
                ...prev,
                examType: value,
                duration: selectedType?.duration || 60,
                questionGroupIds: [], // Reset selected groups when type changes
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
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
            examType: 'TOEIC_FULL_TEST',
            duration: 120,
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
            examType: exam.examType || 'TOEIC_FULL_TEST',
            duration: exam.duration || 120,
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
            examType: 'TOEIC_FULL_TEST',
            duration: 120,
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
