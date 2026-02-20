import httpClient from "../config/httpClient";
import { API } from "../config/configuration";
import { getToken } from "./localStorageService";

const authHeader = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

/**
 * Get user gamification data (XP, level, streak, badges…)
 * GET /api/v1/analytics
 */
export const getUserGamification = async () => {
  try {
    const response = await httpClient.get(API.ANALYTICS_GAMIFICATION, authHeader());
    return response.data.result ?? response.data;
  } catch (error) {
    console.error("Error fetching user gamification:", error);
    throw error;
  }
};

/**
 * Get daily study statistics
 * GET /api/v1/analytics/stats?days={days}
 * @param {number} days - number of days to look back (default 7)
 */
export const getStudyStats = async (days = 7) => {
  try {
    const response = await httpClient.get(API.ANALYTICS_STUDY_STATS(days), authHeader());
    return response.data.result ?? response.data;
  } catch (error) {
    console.error("Error fetching study stats:", error);
    throw error;
  }
};

/**
 * Record study time for the current user
 * POST /api/v1/analytics/study-time
 * @param {number} seconds - number of seconds spent studying
 */
export const recordStudyTime = async (seconds) => {
  try {
    const response = await httpClient.post(
      API.ANALYTICS_RECORD_STUDY_TIME,
      { seconds },
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Error recording study time:", error);
    throw error;
  }
};
