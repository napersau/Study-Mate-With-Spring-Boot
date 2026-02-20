import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, 
    Clock, 
    FileText, 
    CheckCircle,
    XCircle,
    AlertCircle,
    Volume2,
    Image as ImageIcon,
    BookOpen,
    Award
} from 'lucide-react';
import examService from '../../service/examService';
import useStudyTimer from '../../hooks/useStudyTimer';

const ExamDetail = () => {
    const { examId } = useParams();
    const navigate = useNavigate();

    // Đếm thời gian làm bài thi; gọi stopAndSubmit() khi nộp bài
    const { stopAndSubmit: submitStudyTime } = useStudyTimer();
    
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [answers, setAnswers] = useState({}); // {questionId: 'A', ...}
    const [showResults, setShowResults] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(true);

    useEffect(() => {
        fetchExamDetail();
    }, [examId]);

    // Timer countdown
    useEffect(() => {
        if (!exam || !isTimerRunning || timeRemaining <= 0) return;

        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    handleSubmitExam();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [exam, isTimerRunning, timeRemaining]);

    const fetchExamDetail = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.getExamById(examId);
            
            if (response.code === 1000) {
                setExam(response.result);
                setTimeRemaining(response.result.duration * 60); // Convert to seconds
            } else {
                setError(response.message || 'Không thể tải đề thi');
            }
        } catch (err) {
            console.error('Error fetching exam:', err);
            setError('Có lỗi xảy ra khi tải đề thi');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionId, answer) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const handleSubmitExam = async () => {
        setIsTimerRunning(false);
        // Ghi nhận thời gian làm bài trước khi hiển thị kết quả
        await submitStudyTime();
        setShowResults(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const calculateScore = () => {
        if (!exam) return { correct: 0, total: 0, percentage: 0 };

        let correct = 0;
        let total = 0;

        exam.questionGroups.forEach(group => {
            group.questions.forEach(question => {
                total++;
                if (answers[question.id] === question.correctAnswer) {
                    correct++;
                }
            });
        });

        return {
            correct,
            total,
            percentage: total > 0 ? Math.round((correct / total) * 100) : 0
        };
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
        return `${minutes}:${String(secs).padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">Đang tải đề thi...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <button
                    onClick={() => navigate('/exams')}
                    className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 mb-4"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Quay lại danh sách
                </button>
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg">
                    <p className="font-semibold">Lỗi: {error}</p>
                </div>
            </div>
        );
    }

    const score = calculateScore();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            {/* Sticky Header */}
            <div className="sticky top-0 z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg">
                <div className="container mx-auto px-4 py-4 max-w-7xl">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <button
                            onClick={() => navigate('/exams')}
                            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            <span>Quay lại</span>
                        </button>

                        <div className="flex items-center gap-4">
                            {/* Timer */}
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                                timeRemaining < 300 
                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' 
                                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                            }`}>
                                <Clock className="w-5 h-5" />
                                <span className="font-bold">{formatTime(timeRemaining)}</span>
                            </div>

                            {/* Progress */}
                            <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-4 py-2 rounded-full">
                                <FileText className="w-5 h-5" />
                                <span className="font-bold">
                                    {Object.keys(answers).length}/{exam.totalQuestions}
                                </span>
                            </div>

                            {/* Submit Button */}
                            {!showResults && (
                                <button
                                    onClick={handleSubmitExam}
                                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300"
                                >
                                    Nộp bài
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Results Section */}
                {showResults && (
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 mb-8 text-white">
                        <div className="text-center">
                            <Award className="w-20 h-20 mx-auto mb-4 animate-bounce" />
                            <h2 className="text-4xl font-bold mb-4">Kết quả làm bài</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                                    <p className="text-white/90 mb-2">Điểm số</p>
                                    <p className="text-5xl font-bold">{score.percentage}%</p>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                                    <p className="text-white/90 mb-2">Đúng</p>
                                    <p className="text-5xl font-bold text-green-300">{score.correct}</p>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                                    <p className="text-white/90 mb-2">Sai</p>
                                    <p className="text-5xl font-bold text-red-300">{score.total - score.correct}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Exam Header */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
                    <div className="flex items-start gap-4">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-xl">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {exam.title}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                {exam.description}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-lg font-semibold">
                                    {exam.type}
                                </span>
                                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-4 py-2 rounded-lg font-semibold">
                                    {exam.totalQuestions} câu hỏi
                                </span>
                                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-lg font-semibold">
                                    {exam.duration} phút
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Question Groups */}
                {exam.questionGroups.map((group, groupIndex) => (
                    <div key={group.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
                        {/* Group Header */}
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {group.type}
                            </h2>
                            
                            {/* Audio */}
                            {group.audioUrl && (
                                <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mb-4">
                                    <Volume2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    <audio controls className="flex-1">
                                        <source src={group.audioUrl} type="audio/mpeg" />
                                        Trình duyệt không hỗ trợ audio
                                    </audio>
                                </div>
                            )}

                            {/* Image */}
                            {group.imageUrl && (
                                <div className="mb-4">
                                    <img 
                                        src={group.imageUrl} 
                                        alt="Question visual" 
                                        className="max-w-full rounded-xl shadow-lg"
                                    />
                                </div>
                            )}

                            {/* Content */}
                            {group.content && (
                                <div 
                                    className="prose prose-lg dark:prose-invert max-w-none bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl"
                                    dangerouslySetInnerHTML={{ __html: group.content }}
                                />
                            )}
                        </div>

                        {/* Questions */}
                        {group.questions.map((question) => {
                            const userAnswer = answers[question.id];
                            const isCorrect = userAnswer === question.correctAnswer;
                            const isAnswered = !!userAnswer;

                            return (
                                <div 
                                    key={question.id} 
                                    className={`mb-6 p-6 rounded-xl border-2 ${
                                        showResults 
                                            ? isCorrect 
                                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                                                : isAnswered
                                                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                                    : 'border-gray-300 dark:border-gray-600'
                                            : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                >
                                    {/* Question Text */}
                                    <div className="flex items-start gap-3 mb-4">
                                        <span className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold px-3 py-1 rounded-lg">
                                            {question.questionNumber}
                                        </span>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white flex-1">
                                            {question.text}
                                        </p>
                                        {showResults && (
                                            isCorrect 
                                                ? <CheckCircle className="w-6 h-6 text-green-600" />
                                                : isAnswered 
                                                    ? <XCircle className="w-6 h-6 text-red-600" />
                                                    : <AlertCircle className="w-6 h-6 text-gray-400" />
                                        )}
                                    </div>

                                    {/* Options */}
                                    <div className="space-y-3">
                                        {['A', 'B', 'C', 'D'].filter(opt => question[`option${opt}`]).map((option) => {
                                            const optionText = question[`option${option}`];
                                            const isSelected = userAnswer === option;
                                            const isCorrectOption = option === question.correctAnswer;

                                            return (
                                                <label
                                                    key={option}
                                                    className={`
                                                        flex items-start gap-3 p-4 rounded-lg cursor-pointer
                                                        transition-all duration-200
                                                        ${!showResults 
                                                            ? isSelected
                                                                ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                                                                : 'bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 border-2 border-transparent'
                                                            : isCorrectOption
                                                                ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500'
                                                                : isSelected
                                                                    ? 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500'
                                                                    : 'bg-gray-50 dark:bg-gray-700 border-2 border-transparent'
                                                        }
                                                    `}
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`question-${question.id}`}
                                                        value={option}
                                                        checked={isSelected}
                                                        onChange={() => !showResults && handleAnswerChange(question.id, option)}
                                                        disabled={showResults}
                                                        className="mt-1 w-5 h-5 text-blue-600"
                                                    />
                                                    <span className="flex-1 text-gray-900 dark:text-white font-medium">
                                                        <span className="font-bold">{option}.</span> {optionText}
                                                    </span>
                                                    {showResults && isCorrectOption && (
                                                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                    )}
                                                </label>
                                            );
                                        })}
                                    </div>

                                    {/* Explanation */}
                                    {showResults && question.explanation && (
                                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg">
                                            <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">
                                                💡 Giải thích:
                                            </p>
                                            <p className="text-gray-800 dark:text-gray-200">
                                                {question.explanation}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}

                {/* Submit Button at Bottom */}
                {!showResults && (
                    <div className="text-center pb-8">
                        <button
                            onClick={handleSubmitExam}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg px-12 py-4 rounded-full hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                        >
                            Nộp bài thi
                        </button>
                    </div>
                )}

                {/* Retry Button */}
                {showResults && (
                    <div className="text-center pb-8">
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg px-12 py-4 rounded-full hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                        >
                            Làm lại
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamDetail;
