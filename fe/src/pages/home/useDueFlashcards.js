import { useState, useEffect } from 'react';
import flashcardsProgressService from '../../service/flashcardsProgressService';
import { useAuth } from '../../context/AuthContext';

const useDueFlashcards = () => {
  const { isLoggedIn } = useAuth();
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDueFlashcards = async () => {
    if (!isLoggedIn) {
      setFlashcards([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await flashcardsProgressService.getDueFlashcards();
      setFlashcards(response.result || []);
    } catch (err) {
      // Không log error nếu là lỗi authentication
      if (err.response?.status !== 401 && err.response?.status !== 403) {
        setError(err.response?.data?.message || 'Không thể tải flashcards cần ôn');
        console.error('Error fetching due flashcards:', err);
      }
      setFlashcards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDueFlashcards();
  }, [isLoggedIn]);

  return { flashcards, loading, error, refresh: fetchDueFlashcards };
};

export default useDueFlashcards;
