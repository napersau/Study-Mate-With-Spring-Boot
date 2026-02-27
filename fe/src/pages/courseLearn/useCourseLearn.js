import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import courseService from '../../service/courseService';

const useCourseLearn = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);

    useEffect(() => {
        fetchCourse();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseId]);

    const fetchCourse = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await courseService.getCourseById(courseId);
            if (response.code === 1000) {
                const data = response.result;
                // Sắp xếp sections và lessons theo orderIndex
                const sorted = {
                    ...data,
                    sections: (data.sections || [])
                        .slice()
                        .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
                        .map(sec => ({
                            ...sec,
                            lessons: (sec.lessons || [])
                                .slice()
                                .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)),
                        })),
                };
                setCourse(sorted);
                // Tự động chọn bài học đầu tiên
                const firstLesson = sorted.sections?.[0]?.lessons?.[0] || null;
                setActiveLesson(firstLesson);
            } else {
                setError(response.message || 'Không thể tải khóa học');
            }
        } catch (err) {
            console.error('Error fetching course for learn:', err);
            setError('Có lỗi xảy ra khi tải khóa học');
        } finally {
            setLoading(false);
        }
    };

    // Danh sách phẳng tất cả lessons giữ thứ tự
    const allLessons = useMemo(
        () => (course?.sections || []).flatMap(s => s.lessons || []),
        [course]
    );

    const activeLessonIndex = useMemo(
        () => allLessons.findIndex(l => l.id === activeLesson?.id),
        [allLessons, activeLesson]
    );

    const goPrev = () => {
        if (activeLessonIndex > 0) setActiveLesson(allLessons[activeLessonIndex - 1]);
    };

    const goNext = () => {
        if (activeLessonIndex < allLessons.length - 1)
            setActiveLesson(allLessons[activeLessonIndex + 1]);
    };

    return {
        courseId,
        course,
        loading,
        error,
        activeLesson,
        setActiveLesson,
        allLessons,
        activeLessonIndex,
        goPrev,
        goNext,
    };
};

export default useCourseLearn;
