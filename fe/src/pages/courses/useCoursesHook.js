import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import courseService from '../../service/courseService';

export const levelInfo = {
    ALL: { label: 'Tất cả', color: 'from-purple-500 to-pink-500', bgLight: 'bg-purple-50', textColor: 'text-purple-600' },
    Beginner: { label: 'Cơ bản', color: 'from-green-500 to-emerald-500', bgLight: 'bg-green-50', textColor: 'text-green-600' },
    Intermediate: { label: 'Trung cấp', color: 'from-blue-500 to-cyan-500', bgLight: 'bg-blue-50', textColor: 'text-blue-600' },
    Advanced: { label: 'Nâng cao', color: 'from-orange-500 to-red-500', bgLight: 'bg-orange-50', textColor: 'text-orange-600' },
    Expert: { label: 'Chuyên gia', color: 'from-indigo-500 to-purple-500', bgLight: 'bg-indigo-50', textColor: 'text-indigo-600' }
};

const useCoursesHook = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState('ALL');

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await courseService.getAllCourses();

            if (response.code === 1000) {
                setCourses(response.result);
            } else {
                setError(response.message || 'Không thể tải danh sách khóa học');
            }
        } catch (err) {
            console.error('Error fetching courses:', err);
            setError('Có lỗi xảy ra khi tải danh sách khóa học');
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = selectedLevel === 'ALL'
        ? courses.filter(course => course.isPublished)
        : courses.filter(course => course.level === selectedLevel && course.isPublished);

    const handleViewCourse = (courseId) => {
        navigate(`/courses/${courseId}`);
    };

    return {
        loading,
        error,
        selectedLevel,
        setSelectedLevel,
        filteredCourses,
        handleViewCourse,
    };
};

export default useCoursesHook;
