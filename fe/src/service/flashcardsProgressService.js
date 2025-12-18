import httpClient from '../config/httpClient';
import { getToken } from './localStorageService';

const flashcardsProgressService = {
  // Lấy các flashcards cần ôn hôm nay
  getDueFlashcards: async () => {
    try {
      const response = await httpClient.get('/flashcards-progress/due', {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching due flashcards:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      throw error;
    }
  },

  // Cập nhật progress cho flashcard
  updateFlashcardsProgress: async (flashcardsId, judge) => {
    try {
      const response = await httpClient.put(`/flashcards-progress/${flashcardsId}`, {
        judge: judge,
        flashcardsId: flashcardsId,
        lastReviewedAt: new Date().toISOString(),
      }, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating flashcards progress:', error);
      throw error;
    }
  },
};

export default flashcardsProgressService;
