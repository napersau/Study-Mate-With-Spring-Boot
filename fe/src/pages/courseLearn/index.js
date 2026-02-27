import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    FileText,
    Video,
    Layers,
    ClipboardList,
    ChevronDown,
    ChevronUp,
    CheckCircle,
    Menu,
    X,
    ExternalLink,
    Play,
    Loader2,
    AlertCircle,
    RotateCcw,
    Volume2,
} from 'lucide-react';
import useStudyTimer from '../../hooks/useStudyTimer';
import useCourseLearn from './useCourseLearn';

/* ─── Helpers ──────────────────────────────────────────────── */
const LESSON_TYPE_META = {
    VIDEO:      { icon: Video,         label: 'Video',         color: 'text-blue-600 dark:text-blue-400',     bg: 'bg-blue-100 dark:bg-blue-900/40' },
    DOCUMENT:   { icon: FileText,      label: 'Tài liệu',     color: 'text-green-600 dark:text-green-400',   bg: 'bg-green-100 dark:bg-green-900/40' },
    FLASHCARD:  { icon: Layers,        label: 'Flashcard',    color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/40' },
    EXAM:       { icon: ClipboardList, label: 'Kiểm tra',     color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/40' },
};
const getMeta = (type) =>
    LESSON_TYPE_META[type] || { icon: BookOpen, label: 'Bài học', color: 'text-gray-600', bg: 'bg-gray-100' };

const formatDuration = (sec) => {
    if (!sec) return null;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return m > 0 ? `${m} phút${s > 0 ? ' ' + s + 'g' : ''}` : `${s} giây`;
};

const getYouTubeId = (url) => {
    if (!url) return null;
    const m =
        url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/\s]+)/) ||
        url.match(/youtube\.com\/embed\/([^&?/\s]+)/);
    return m ? m[1] : null;
};

/* ─── Inline Flashcard Viewer ───────────────────────────────── */
const FlashcardViewer = ({ deck }) => {
    const cards = useMemo(
        () => deck?.flashcardsList || deck?.flashcards || [],
        [deck]
    );
    const [idx, setIdx] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const current = cards[idx] || null;

    if (!deck) return <div className="text-gray-400 italic">Không có dữ liệu flashcard.</div>;
    if (cards.length === 0) return <div className="text-gray-400 italic">Bộ thẻ này chưa có flashcard nào.</div>;

    const goTo = (n) => { setIdx(n); setFlipped(false); };

    return (
        <div className="flex flex-col items-center gap-6 py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Thẻ {idx + 1} / {cards.length} &bull; <span className="font-semibold">{deck.name || deck.title || 'Bộ thẻ'}</span>
            </p>

            {/* Card */}
            <div
                className="w-full max-w-2xl min-h-52 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800
                    border-2 border-purple-200 dark:border-purple-700 rounded-2xl shadow-xl flex flex-col items-center justify-center gap-4
                    cursor-pointer select-none p-8 transition-all duration-200 hover:shadow-2xl"
                onClick={() => setFlipped(f => !f)}
            >
                <p className="text-xs font-semibold uppercase tracking-widest text-purple-500 dark:text-purple-300">
                    {flipped ? 'Mặt sau' : 'Mặt trước'}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                    {flipped ? current?.backText || current?.back : current?.frontText || current?.front}
                </p>
                <p className="text-xs text-gray-400 mt-2">Click để lật thẻ</p>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => goTo(idx - 1)}
                    disabled={idx === 0}
                    className="px-4 py-2 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-semibold text-sm
                        disabled:opacity-40 disabled:cursor-not-allowed hover:bg-purple-200 dark:hover:bg-purple-800/60 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                    onClick={() => { setIdx(0); setFlipped(false); }}
                    className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    title="Bắt đầu lại"
                >
                    <RotateCcw className="w-4 h-4" />
                </button>
                <button
                    onClick={() => goTo(idx + 1)}
                    disabled={idx >= cards.length - 1}
                    className="px-4 py-2 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-semibold text-sm
                        disabled:opacity-40 disabled:cursor-not-allowed hover:bg-purple-200 dark:hover:bg-purple-800/60 transition-colors"
                >
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

/* ─── Lesson Content ─────────────────────────────────────────── */
const LessonContent = ({ lesson, navigate }) => {
    if (!lesson) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-500 gap-3">
                <BookOpen className="w-12 h-12 opacity-40" />
                <p>Chọn một bài học từ danh sách bên trái để bắt đầu.</p>
            </div>
        );
    }

    const meta = getMeta(lesson.type);
    const Icon = meta.icon;

    /* VIDEO */
    if (lesson.type === 'VIDEO') {
        const ytId = getYouTubeId(lesson.videoUrl);
        return (
            <div className="flex flex-col gap-6">
                {/* Lesson title */}
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${meta.bg}`}>
                        <Icon className={`w-5 h-5 ${meta.color}`} />
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{meta.label}</p>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{lesson.title}</h2>
                    </div>
                </div>

                {lesson.duration && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        ⏱ Thời lượng: <span className="font-semibold">{formatDuration(lesson.duration)}</span>
                    </p>
                )}

                {/* Video player */}
                {lesson.videoUrl ? (
                    ytId ? (
                        <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl" style={{ paddingTop: '56.25%' }}>
                            <iframe
                                className="absolute inset-0 w-full h-full"
                                src={`https://www.youtube.com/embed/${ytId}?rel=0`}
                                title={lesson.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    ) : (
                        <video
                            src={lesson.videoUrl}
                            controls
                            className="w-full rounded-2xl shadow-2xl max-h-[520px] bg-black"
                        >
                            Trình duyệt của bạn không hỗ trợ video.
                        </video>
                    )
                ) : (
                    <div className="flex flex-col items-center justify-center h-52 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-400 gap-3">
                        <Play className="w-10 h-10 opacity-40" />
                        <p>Video chưa được cung cấp.</p>
                    </div>
                )}
            </div>
        );
    }

    /* DOCUMENT */
    if (lesson.type === 'DOCUMENT') {
        const doc = lesson.document;
        return (
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${meta.bg}`}>
                        <Icon className={`w-5 h-5 ${meta.color}`} />
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{meta.label}</p>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{lesson.title}</h2>
                    </div>
                </div>

                {doc?.content ? (
                    <div
                        className="prose prose-lg max-w-none text-gray-900 dark:text-gray-100
                            prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
                            prose-p:text-gray-900 dark:prose-p:text-gray-100 prose-p:leading-relaxed
                            prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6
                            prose-li:text-gray-900 dark:prose-li:text-gray-100 prose-li:mb-1
                            prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-extrabold
                            prose-a:text-blue-600 dark:prose-a:text-blue-300 prose-a:underline
                            prose-code:text-pink-700 dark:prose-code:text-pink-300
                            prose-code:bg-pink-100 dark:prose-code:bg-pink-900/30 prose-code:px-1.5 prose-code:rounded
                            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:p-4
                            prose-blockquote:border-l-4 prose-blockquote:border-green-500 prose-blockquote:bg-green-50 dark:prose-blockquote:bg-green-900/20 prose-blockquote:px-4 prose-blockquote:italic
                            prose-img:rounded-xl prose-img:shadow
                        "
                        dangerouslySetInnerHTML={{ __html: doc.content }}
                    />
                ) : doc ? (
                    <button
                        onClick={() => navigate(`/documents/${doc.category?.toLowerCase() || 'general'}/${doc.id}`)}
                        className="self-start flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow transition-colors"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Xem tài liệu
                    </button>
                ) : (
                    <div className="flex flex-col items-center justify-center h-40 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-400 gap-2">
                        <AlertCircle className="w-8 h-8 opacity-40" />
                        <p>Tài liệu chưa được cung cấp.</p>
                    </div>
                )}
            </div>
        );
    }

    /* FLASHCARD */
    if (lesson.type === 'FLASHCARD') {
        const deck = lesson.deck;
        return (
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${meta.bg}`}>
                        <Icon className={`w-5 h-5 ${meta.color}`} />
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{meta.label}</p>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{lesson.title}</h2>
                    </div>
                </div>

                {deck ? (
                    <>
                        <FlashcardViewer deck={deck} />
                        <button
                            onClick={() => navigate(`/decks/${deck.id}`)}
                            className="self-start flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl shadow transition-colors"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Mở trang ôn tập đầy đủ
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-40 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-400 gap-2">
                        <AlertCircle className="w-8 h-8 opacity-40" />
                        <p>Bộ thẻ chưa được cung cấp.</p>
                    </div>
                )}
            </div>
        );
    }

    /* EXAM */
    if (lesson.type === 'EXAM') {
        const exam = lesson.exam;
        return (
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${meta.bg}`}>
                        <Icon className={`w-5 h-5 ${meta.color}`} />
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{meta.label}</p>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{lesson.title}</h2>
                    </div>
                </div>

                {exam ? (
                    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-2xl p-8 flex flex-col gap-4">
                        <h3 className="text-xl font-bold text-orange-800 dark:text-orange-200">{exam.title}</h3>
                        {exam.description && (
                            <p className="text-gray-700 dark:text-gray-300">{exam.description}</p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                            {exam.duration && (
                                <span className="flex items-center gap-1">
                                    ⏱ Thời gian: <strong>{exam.duration} phút</strong>
                                </span>
                            )}
                            {exam.questions?.length > 0 && (
                                <span className="flex items-center gap-1">
                                    📝 Số câu: <strong>{exam.questions.length}</strong>
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => navigate(`/exams/${exam.id}`)}
                            className="self-start flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-105"
                        >
                            <ClipboardList className="w-5 h-5" />
                            Bắt đầu làm bài
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-40 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-400 gap-2">
                        <AlertCircle className="w-8 h-8 opacity-40" />
                        <p>Bài kiểm tra chưa được cung cấp.</p>
                    </div>
                )}
            </div>
        );
    }

    /* Fallback */
    return (
        <div className="flex flex-col items-center justify-center h-40 text-gray-400 gap-2">
            <AlertCircle className="w-8 h-8 opacity-40" />
            <p>Loại bài học không được hỗ trợ: {lesson.type}</p>
        </div>
    );
};

/* ─── Main Page ──────────────────────────────────────────────── */
const CourseLearn = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [openSections, setOpenSections] = useState({});

    useStudyTimer();

    const {
        course,
        loading,
        error,
        activeLesson,
        setActiveLesson,
        allLessons,
        activeLessonIndex,
        goPrev,
        goNext,
    } = useCourseLearn();

    const toggleSection = (id) =>
        setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));

    // Mở section chứa bài đang active
    const activeSectionId = useMemo(() => {
        if (!course || !activeLesson) return null;
        for (const sec of course.sections || []) {
            if ((sec.lessons || []).some(l => l.id === activeLesson.id)) return sec.id;
        }
        return null;
    }, [course, activeLesson]);

    /* Loading */
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <Loader2 className="w-14 h-14 animate-spin text-purple-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300 font-medium">Đang tải khóa học...</p>
                </div>
            </div>
        );
    }

    /* Error */
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 bg-gray-50 dark:bg-gray-900">
                <AlertCircle className="w-16 h-16 text-red-500" />
                <p className="text-red-600 dark:text-red-400 font-semibold text-lg text-center">{error}</p>
                <button
                    onClick={() => navigate('/courses')}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
                </button>
            </div>
        );
    }

    if (!course) return null;

    const totalLessons = allLessons.length;

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">

            {/* ── SIDEBAR ──────────────────────────────────────── */}
            <aside
                className={`
                    flex-shrink-0 flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
                    transition-all duration-300 overflow-hidden
                    ${sidebarOpen ? 'w-80' : 'w-0'}
                `}
            >
                {/* Sidebar header */}
                <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-pink-600">
                    <button
                        onClick={() => navigate(`/courses/${course.id}`)}
                        className="flex items-center gap-2 text-white/80 hover:text-white text-sm mb-3 transition-colors w-full text-left"
                    >
                        <ArrowLeft className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">Quay lại chi tiết</span>
                    </button>
                    <h2 className="text-white font-bold text-sm leading-snug line-clamp-2">{course.title}</h2>
                    <p className="text-white/70 text-xs mt-1">
                        {activeLessonIndex + 1} / {totalLessons} bài học
                    </p>
                    {/* Progress bar */}
                    <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white rounded-full transition-all duration-500"
                            style={{ width: `${totalLessons > 0 ? ((activeLessonIndex + 1) / totalLessons) * 100 : 0}%` }}
                        />
                    </div>
                </div>

                {/* Sections list */}
                <div className="flex-1 overflow-y-auto">
                    {(course.sections || []).map((section, sIdx) => {
                        const isOpen = openSections[section.id] !== false
                            ? (openSections[section.id] === true || section.id === activeSectionId || sIdx === 0)
                            : false;
                        const lessons = section.lessons || [];
                        return (
                            <div key={section.id} className="border-b border-gray-100 dark:border-gray-700">
                                {/* Section header */}
                                <button
                                    onClick={() => toggleSection(section.id)}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center font-bold">
                                        {sIdx + 1}
                                    </span>
                                    <span className="flex-1 text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-2">
                                        {section.title}
                                    </span>
                                    {isOpen
                                        ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                                </button>

                                {/* Lessons */}
                                {isOpen && lessons.map((lesson) => {
                                    const meta = getMeta(lesson.type);
                                    const LIcon = meta.icon;
                                    const isActive = lesson.id === activeLesson?.id;
                                    return (
                                        <button
                                            key={lesson.id}
                                            onClick={() => setActiveLesson(lesson)}
                                            className={`w-full flex items-start gap-3 px-5 py-3 text-left transition-colors border-l-4 ${
                                                isActive
                                                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                                                    : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            <div className={`flex-shrink-0 mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center ${meta.bg}`}>
                                                <LIcon className={`w-3.5 h-3.5 ${meta.color}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-xs font-medium leading-snug line-clamp-2 ${
                                                    isActive
                                                        ? 'text-purple-700 dark:text-purple-300'
                                                        : 'text-gray-700 dark:text-gray-300'
                                                }`}>
                                                    {lesson.title}
                                                </p>
                                                <p className="text-[10px] text-gray-400 mt-0.5">{meta.label}</p>
                                            </div>
                                            {isActive && (
                                                <CheckCircle className="flex-shrink-0 w-4 h-4 text-purple-600 mt-0.5" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </aside>

            {/* ── MAIN CONTENT ─────────────────────────────────── */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <header className="flex-shrink-0 flex items-center gap-3 px-5 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
                    <button
                        onClick={() => setSidebarOpen(o => !o)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title={sidebarOpen ? 'Ẩn danh sách bài học' : 'Hiện danh sách bài học'}
                    >
                        {sidebarOpen ? <X className="w-5 h-5 text-gray-600 dark:text-gray-300" /> : <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
                    </button>

                    <div className="h-5 w-px bg-gray-200 dark:bg-gray-600" />

                    <h1 className="flex-1 text-sm font-semibold text-gray-700 dark:text-gray-200 truncate">
                        {activeLesson ? activeLesson.title : course.title}
                    </h1>

                    {/* Prev / Next */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={goPrev}
                            disabled={activeLessonIndex <= 0}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium
                                bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200
                                hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Trước
                        </button>
                        <button
                            onClick={goNext}
                            disabled={activeLessonIndex >= totalLessons - 1}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium
                                bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Tiếp <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </header>

                {/* Scrollable content */}
                <main className="flex-1 overflow-y-auto p-8 md:p-10">
                    <div className="max-w-4xl mx-auto">
                        <LessonContent lesson={activeLesson} navigate={navigate} />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CourseLearn;
