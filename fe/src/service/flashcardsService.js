import httpClient from "../config/httpClient";
import { API } from "../config/configuration";

/**
 * Create new flashcard
 * @param {object} flashcardsData - Flashcard data
 * @returns {Promise} Create response
 */
export const createFlashcard = async (flashcardsData) => {
  try {
    const response = await httpClient.post(API.FLASHCARDS, flashcardsData);
    return response.data;
  } catch (error) {
    console.error("Error creating flashcard:", error);
    throw error;
  }
};

/**
 * Get all flashcards
 * @returns {Promise} List of flashcards
 */
export const getAllFlashcards = async () => {
  try {
    const response = await httpClient.get(API.FLASHCARDS);
    return response.data;
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    throw error;
  }
};

/**
 * Update flashcard
 * @param {string} id - Flashcard ID
 * @param {object} flashcardsData - Updated flashcard data
 * @returns {Promise} Update response
 */
export const updateFlashcard = async (id, flashcardsData) => {
  try {
    const response = await httpClient.put(`${API.FLASHCARDS}/${id}`, flashcardsData);
    return response.data;
  } catch (error) {
    console.error("Error updating flashcard:", error);
    throw error;
  }
};

/**
 * Delete flashcard
 * @param {string} id - Flashcard ID
 * @returns {Promise} Delete response
 */
export const deleteFlashcard = async (id) => {
  try {
    const response = await httpClient.delete(`${API.FLASHCARDS}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting flashcard:", error);
    throw error;
  }
};
