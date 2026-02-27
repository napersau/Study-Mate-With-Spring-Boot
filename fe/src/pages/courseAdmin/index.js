import React, { useState, useEffect, useCallback } from 'react';
import {
    Plus,
    Edit,
    Trash2,
    CheckCircle,
    X,
    Save,
    BookOpen,
    DollarSign,
    Award,
    ChevronDown,
    ChevronRight,
    Video,
    FileText,
    Layers,
    ClipboardList,
    GripVertical,
} from 'lucide-react';
import courseService from '../../service/courseService';

/* ─────────────────────────── helpers ─────────────────────────── */
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const newLesson = (orderIndex = 1) => ({
    _id: uid(),
    title: '',
    orderIndex,
    isFree: false,
    type: 'VIDEO',
    videoUrl: '',
    duration: '',
    documentId: '',
    deckId: '',
    examId: '',
});

const newSection = (orderIndex = 1) => ({
    _id: uid(),
    title: '',
    orderIndex,
    expanded: true,
    lessons: [newLesson(1)],
});

const LESSON_TYPES = [
    { value: 'VIDEO',     label: 'Video',        Icon: Video },
    { value: 'DOCUMENT',  label: 'Tài liệu',     Icon: FileText },
    { value: 'FLASHCARD', label: 'Flashcard',    Icon: Layers },
    { value: 'EXAM',      label: 'Bài kiểm tra', Icon: ClipboardList },
];

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

/* ─────────────────────────── sub-components ─────────────────────────── */
const inputCls =
    'w-full px-3 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none text-sm';

function LessonForm({ lesson, sectionId, onChange, onRemove }) {
    const handle = (field, value) => onChange(sectionId, lesson._id, field, value);

    return (
        <div className="bg-white dark:bg-gray-750 border border-gray-200 dark:border-gray-600 rounded-xl p-4 mb-3">
            {/* Header row */}
            <div className="flex items-start gap-3 mb-3">
                <GripVertical className="w-4 h-4 mt-2 text-gray-400 flex-shrink-0" />
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                            Tên bài học <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={lesson.title}
                            onChange={e => handle('title', e.target.value)}
                            className={inputCls}
                            placeholder="VD: Giới thiệu chương trình"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                            Thứ tự
                        </label>
                        <input
                            type="number"
                            value={lesson.orderIndex}
                            onChange={e => handle('orderIndex', parseInt(e.target.value) || 1)}
                            className={inputCls}
                            min="1"
                        />
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => onRemove(sectionId, lesson._id)}
                    className="mt-6 p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors flex-shrink-0"
                    title="Xóa bài học"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Type + isFree */}
            <div className="flex flex-wrap items-center gap-3 mb-3 pl-7">
                <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                        Loại bài học
                    </label>
                    <div className="flex gap-2 flex-wrap">
                        {LESSON_TYPES.map(({ value, label, Icon }) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => handle('type', value)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 text-xs font-semibold transition-all ${
                                    lesson.type === value
                                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                        : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-purple-300'
                                }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer mt-4 select-none">
                    <input
                        type="checkbox"
                        checked={lesson.isFree}
                        onChange={e => handle('isFree', e.target.checked)}
                        className="w-4 h-4 accent-purple-600"
                    />
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                        Học thử miễn phí
                    </span>
                </label>
            </div>

            {/* Type-specific fields */}
            <div className="pl-7">
                {lesson.type === 'VIDEO' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-2">
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                                URL Video (YouTube / Cloud)
                            </label>
                            <input
                                type="url"
                                value={lesson.videoUrl}
                                onChange={e => handle('videoUrl', e.target.value)}
                                className={inputCls}
                                placeholder="https://youtube.com/..."
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                                Thời lượng (giây)
                            </label>
                            <input
                                type="number"
                                value={lesson.duration}
                                onChange={e => handle('duration', e.target.value)}
                                className={inputCls}
                                placeholder="VD: 360"
                                min="0"
                            />
                        </div>
                    </div>
                )}
                {lesson.type === 'DOCUMENT' && (
                    <div>
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                            Document ID
                        </label>
                        <input
                            type="number"
                            value={lesson.documentId}
                            onChange={e => handle('documentId', e.target.value)}
                            className={inputCls}
                            placeholder="ID của tài liệu"
                        />
                    </div>
                )}
                {lesson.type === 'FLASHCARD' && (
                    <div>
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                            Deck ID (Bộ thẻ)
                        </label>
                        <input
                            type="number"
                            value={lesson.deckId}
                            onChange={e => handle('deckId', e.target.value)}
                            className={inputCls}
                            placeholder="ID của bộ thẻ Flashcard"
                        />
                    </div>
                )}
                {lesson.type === 'EXAM' && (
                    <div>
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                            Exam ID (Bài kiểm tra)
                        </label>
                        <input
                            type="number"
                            value={lesson.examId}
                            onChange={e => handle('examId', e.target.value)}
                            className={inputCls}
                            placeholder="ID của bài kiểm tra"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

function SectionForm({ section, index, onToggle, onSectionChange, onRemoveSection, onLessonChange, onAddLesson, onRemoveLesson }) {
    return (
        <div className="border-2 border-gray-200 dark:border-gray-600 rounded-xl mb-4 overflow-hidden">
            {/* Section header */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 px-4 py-3">
                <button type="button" onClick={() => onToggle(section._id)} className="text-gray-600 dark:text-gray-300">
                    {section.expanded
                        ? <ChevronDown className="w-5 h-5" />
                        : <ChevronRight className="w-5 h-5" />}
                </button>
                <span className="bg-purple-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                    {index + 1}
                </span>
                <input
                    type="text"
                    value={section.title}
                    onChange={e => onSectionChange(section._id, 'title', e.target.value)}
                    className="flex-1 bg-transparent border-b-2 border-gray-300 dark:border-gray-500 focus:border-purple-500 outline-none text-gray-900 dark:text-white font-semibold text-sm py-0.5"
                    placeholder={`Tên chương ${index + 1}...`}
                />
                <input
                    type="number"
                    value={section.orderIndex}
                    onChange={e => onSectionChange(section._id, 'orderIndex', parseInt(e.target.value) || 1)}
                    className="w-16 text-center bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-xs py-1 text-gray-900 dark:text-white"
                    min="1"
                    title="Thứ tự chương"
                />
                <button
                    type="button"
                    onClick={() => onRemoveSection(section._id)}
                    className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    title="Xóa chương"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Lessons */}
            {section.expanded && (
                <div className="p-4">
                    {section.lessons.length === 0 && (
                        <p className="text-center text-gray-400 text-sm py-4">
                            Chưa có bài học nào trong chương này
                        </p>
                    )}
                    {section.lessons.map(lesson => (
                        <LessonForm
                            key={lesson._id}
                            lesson={lesson}
                            sectionId={section._id}
                            onChange={onLessonChange}
                            onRemove={onRemoveLesson}
                        />
                    ))}
                    <button
                        type="button"
                        onClick={() => onAddLesson(section._id)}
                        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-purple-400 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 py-2 rounded-xl text-sm font-semibold transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Thêm bài học
                    </button>
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────── main component ─────────────────────────── */
const CourseAdmin = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [mode, setMode] = useState('list'); // 'list' | 'create' | 'edit'
    const [editingCourse, setEditingCourse] = useState(null);

    const emptyForm = {
        title: '',
        description: '',
        price: '',
        level: 'Beginner',
        sections: [],
    };

    const [formData, setFormData] = useState(emptyForm);

    useEffect(() => { fetchCourses(); }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await courseService.getAllCourses();
            if (response.code === 1000) setCourses(response.result);
        } catch (err) {
            console.error(err);
            setError('Không thể tải danh sách khóa học');
        } finally {
            setLoading(false);
        }
    };

    /* ── basic field handler ── */
    const handleInputChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    /* ── section helpers ── */
    const addSection = () =>
        setFormData(prev => ({
            ...prev,
            sections: [...prev.sections, newSection(prev.sections.length + 1)],
        }));

    const removeSection = useCallback(sId =>
        setFormData(prev => ({
            ...prev,
            sections: prev.sections.filter(s => s._id !== sId),
        })), []);

    const toggleSection = useCallback(sId =>
        setFormData(prev => ({
            ...prev,
            sections: prev.sections.map(s =>
                s._id === sId ? { ...s, expanded: !s.expanded } : s),
        })), []);

    const updateSectionField = useCallback((sId, field, value) =>
        setFormData(prev => ({
            ...prev,
            sections: prev.sections.map(s =>
                s._id === sId ? { ...s, [field]: value } : s),
        })), []);

    /* ── lesson helpers ── */
    const addLesson = useCallback(sId =>
        setFormData(prev => ({
            ...prev,
            sections: prev.sections.map(s => {
                if (s._id !== sId) return s;
                return { ...s, lessons: [...s.lessons, newLesson(s.lessons.length + 1)] };
            }),
        })), []);

    const removeLesson = useCallback((sId, lId) =>
        setFormData(prev => ({
            ...prev,
            sections: prev.sections.map(s => {
                if (s._id !== sId) return s;
                return { ...s, lessons: s.lessons.filter(l => l._id !== lId) };
            }),
        })), []);

    const updateLessonField = useCallback((sId, lId, field, value) =>
        setFormData(prev => ({
            ...prev,
            sections: prev.sections.map(s => {
                if (s._id !== sId) return s;
                return {
                    ...s,
                    lessons: s.lessons.map(l =>
                        l._id === lId ? { ...l, [field]: value } : l),
                };
            }),
        })), []);

    /* ── build API payload ── */
    const buildPayload = () => ({
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: formData.price !== '' ? parseFloat(formData.price) : 0,
        level: formData.level,
        sections: formData.sections.map(({ title, orderIndex, lessons }) => ({
            title: title.trim(),
            orderIndex,
            lessons: lessons.map(({ title: lt, orderIndex: lo, isFree, type, videoUrl, duration, documentId, deckId, examId }) => {
                const lesson = { title: lt.trim(), orderIndex: lo, isFree, type };
                if (type === 'VIDEO') {
                    lesson.videoUrl = videoUrl || null;
                    lesson.duration = duration !== '' ? parseInt(duration) : null;
                }
                if (type === 'DOCUMENT')  lesson.documentId  = documentId  !== '' ? parseInt(documentId)  : null;
                if (type === 'FLASHCARD') lesson.deckId      = deckId      !== '' ? parseInt(deckId)      : null;
                if (type === 'EXAM')      lesson.examId      = examId      !== '' ? parseInt(examId)      : null;
                return lesson;
            }),
        })),
    });

    /* ── submit ── */
    const handleSubmit = async e => {
        e.preventDefault();
        if (!formData.title.trim()) { setError('Tiêu đề không được để trống'); return; }

        try {
            setLoading(true);
            setError(null);
            const payload = buildPayload();

            let response;
            if (mode === 'edit' && editingCourse) {
                response = await courseService.updateCourse(editingCourse.id, payload);
                setSuccess('Cập nhật khóa học thành công!');
            } else {
                response = await courseService.createCourse(payload);
                setSuccess('Tạo khóa học mới thành công!');
            }

            if (response.code === 1000) {
                resetForm();
                setMode('list');
                fetchCourses();
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (err) {
            console.error(err);
            setError('Có lỗi xảy ra khi lưu khóa học');
        } finally {
            setLoading(false);
        }
    };

    /* ── edit ── */
    const handleEdit = course => {
        setEditingCourse(course);
        const sections = (course.sections || []).map(s => ({
            _id: uid(),
            title: s.title || '',
            orderIndex: s.orderIndex || 1,
            expanded: true,
            lessons: (s.lessons || []).map(l => ({
                _id: uid(),
                title: l.title || '',
                orderIndex: l.orderIndex || 1,
                isFree: l.isFree || false,
                type: l.type || 'VIDEO',
                videoUrl: l.videoUrl || '',
                duration: l.duration != null ? String(l.duration) : '',
                documentId: l.documentId != null ? String(l.documentId) : '',
                deckId: l.deckId != null ? String(l.deckId) : '',
                examId: l.examId != null ? String(l.examId) : '',
            })),
        }));
        setFormData({
            title: course.title || '',
            description: course.description || '',
            price: course.price != null ? String(course.price) : '',
            level: course.level || 'Beginner',
            sections,
        });
        setMode('edit');
    };

    /* ── delete ── */
    const handleDelete = async courseId => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa khóa học này?')) return;
        try {
            setLoading(true);
            await courseService.deleteCourse(courseId);
            setSuccess('Xóa khóa học thành công!');
            fetchCourses();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error(err);
            setError('Có lỗi xảy ra khi xóa khóa học');
        } finally {
            setLoading(false);
        }
    };

    /* ── publish ── */
    const handlePublish = async courseId => {
        try {
            setLoading(true);
            const response = await courseService.publishCourse(courseId);
            if (response.code === 1000) {
                setSuccess('Xuất bản khóa học thành công!');
                fetchCourses();
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (err) {
            console.error(err);
            setError('Có lỗi xảy ra khi xuất bản khóa học');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => { setFormData(emptyForm); setEditingCourse(null); setError(null); };
    const handleCancel = () => { resetForm(); setMode('list'); };

    /* ─────────────────── render ─────────────────── */
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
            <div className="max-w-5xl mx-auto">

                {/* ── Page header ── */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl">
                                <BookOpen className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    Quản Lý Khóa Học
                                </h1>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {mode === 'list' ? 'Danh sách khóa học'
                                        : mode === 'edit' ? 'Chỉnh sửa khóa học'
                                        : 'Tạo khóa học mới'}
                                </p>
                            </div>
                        </div>
                        {mode === 'list' && (
                            <button
                                onClick={() => { resetForm(); setMode('create'); }}
                                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                            >
                                <Plus className="w-5 h-5" />
                                Tạo khóa học mới
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Alerts ── */}
                {success && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-lg mb-6">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* ══════════ LIST mode ══════════ */}
                {mode === 'list' && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                        {loading ? (
                            <div className="text-center py-12 text-gray-500">Đang tải...</div>
                        ) : courses.length === 0 ? (
                            <div className="text-center py-12">
                                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 dark:text-gray-400">Chưa có khóa học nào</p>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {courses.map(course => (
                                    <div
                                        key={course.id}
                                        className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border-l-4 border-purple-600"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                        {course.title}
                                                    </h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                        course.isPublished
                                                            ? 'bg-green-500 text-white'
                                                            : 'bg-gray-400 text-white'
                                                    }`}>
                                                        {course.isPublished ? 'Đã xuất bản' : 'Nháp'}
                                                    </span>
                                                </div>
                                                <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                                                    {course.description}
                                                </p>
                                                <div className="flex flex-wrap gap-3 text-sm">
                                                    <span className="flex items-center gap-1.5 bg-white dark:bg-gray-600 px-3 py-1.5 rounded-lg">
                                                        <Award className="w-4 h-4 text-purple-600" />
                                                        <span className="font-semibold">{course.level}</span>
                                                    </span>
                                                    <span className="flex items-center gap-1.5 bg-white dark:bg-gray-600 px-3 py-1.5 rounded-lg">
                                                        <DollarSign className="w-4 h-4 text-green-600" />
                                                        <span className="font-semibold">
                                                            {course.price ? `${Number(course.price).toLocaleString()}đ` : 'Miễn phí'}
                                                        </span>
                                                    </span>
                                                    {course.sections && (
                                                        <span className="flex items-center gap-1.5 bg-white dark:bg-gray-600 px-3 py-1.5 rounded-lg">
                                                            <Layers className="w-4 h-4 text-blue-600" />
                                                            <span className="font-semibold">
                                                                {course.sections.length} chương
                                                            </span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2 ml-4">
                                                {!course.isPublished && (
                                                    <button
                                                        onClick={() => handlePublish(course.id)}
                                                        className="p-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                                        title="Xuất bản"
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleEdit(course)}
                                                    className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(course.id)}
                                                    className="p-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                    title="Xóa"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ══════════ CREATE / EDIT form ══════════ */}
                {(mode === 'create' || mode === 'edit') && (
                    <form onSubmit={handleSubmit}>
                        {/* ── Basic info ── */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-purple-600" />
                                Thông tin cơ bản
                            </h2>

                            <div className="mb-5">
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                                    Tiêu đề khóa học <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className={inputCls}
                                    placeholder="VD: Khóa học IELTS cho người mới bắt đầu"
                                    maxLength={255}
                                    required
                                />
                            </div>

                            <div className="mb-5">
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                                    Mô tả
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className={inputCls}
                                    placeholder="Mô tả ngắn gọn về khóa học..."
                                    maxLength={500}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                                        <DollarSign className="inline w-4 h-4 text-green-600 mr-1" />
                                        Giá khóa học (VNĐ)
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className={inputCls}
                                        placeholder="0 = Miễn phí"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                                        <Award className="inline w-4 h-4 text-purple-600 mr-1" />
                                        Trình độ
                                    </label>
                                    <select
                                        name="level"
                                        value={formData.level}
                                        onChange={handleInputChange}
                                        className={inputCls}
                                    >
                                        {LEVELS.map(l => (
                                            <option key={l} value={l}>{l}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* ── Sections builder ── */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Layers className="w-5 h-5 text-purple-600" />
                                    Chương học &amp; Bài học
                                    <span className="ml-2 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-semibold px-2 py-0.5 rounded-full">
                                        {formData.sections.length} chương
                                    </span>
                                </h2>
                                <button
                                    type="button"
                                    onClick={addSection}
                                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                    Thêm chương
                                </button>
                            </div>

                            {formData.sections.length === 0 ? (
                                <div className="text-center py-10 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
                                    <Layers className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                                        Chưa có chương nào. Nhấn <strong>Thêm chương</strong> để bắt đầu.
                                    </p>
                                </div>
                            ) : (
                                formData.sections.map((section, idx) => (
                                    <SectionForm
                                        key={section._id}
                                        section={section}
                                        index={idx}
                                        onToggle={toggleSection}
                                        onSectionChange={updateSectionField}
                                        onRemoveSection={removeSection}
                                        onLessonChange={updateLessonField}
                                        onAddLesson={addLesson}
                                        onRemoveLesson={removeLesson}
                                    />
                                ))
                            )}
                        </div>

                        {/* ── Action buttons ── */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                {loading ? 'Đang lưu...' : mode === 'edit' ? 'Cập nhật khóa học' : 'Tạo khóa học'}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex items-center justify-center gap-2 bg-gray-500 text-white font-bold px-8 py-4 rounded-xl hover:bg-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                                Hủy
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CourseAdmin;
