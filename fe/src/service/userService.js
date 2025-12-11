import httpClient from "../config/httpClient";
import { API } from "../config/configuration";
import { getToken } from "./localStorageService";

/**
 * Get current user information
 * @returns {Promise} User info response
 */
export const getMyInfo = async () => {
  try {
    const response = await httpClient.get(API.MY_INFO, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Promise} User data
 */
export const getUserById = async (userId) => {
  try {
    const response = await httpClient.get(API.GET_USER(userId), {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
};

/**
 * Get all users
 * @returns {Promise} List of all users
 */
export const getAllUsers = async () => {
  try {
    const response = await httpClient.get(API.GET_ALL_USERS, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

/**
 * Search users by username
 * @param {string} keyword - Search keyword
 * @returns {Promise} Search results
 */
export const searchUsers = async (keyword) => {
  try {
    const response = await httpClient.post(
      API.SEARCH_USER,
      { username: keyword },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
};

/**
 * Update user profile
 * @param {object} profileData - Profile data to update
 * @returns {Promise} Updated profile response
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await httpClient.put(API.UPDATE_PROFILE, profileData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

/**
 * Upload user avatar
 * @param {FormData} formData - Form data with image file
 * @returns {Promise} Upload response
 */
export const uploadAvatar = async (formData) => {
  try {
    const response = await httpClient.put(API.UPDATE_AVATAR, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
};

/**
 * Toggle user active status
 * @param {string} userId - User ID
 * @returns {Promise} Response
 */
export const toggleActiveUser = async (userId) => {
  try {
    const response = await httpClient.post(
      `${API.TOGGLE_ACTIVE_USER}/${userId}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling user status:", error);
    throw error;
  }
};

/**
 * Forgot password request
 * @param {string} email - User email
 * @returns {Promise} Response
 */
export const forgotPassword = async (email) => {
  try {
    const response = await httpClient.post(API.FORGOT_PASSWORD, { email });
    return response.data;
  } catch (error) {
    console.error("Error requesting password reset:", error);
    throw error;
  }
};

/**
 * Verify OTP
 * @param {string} email - User email
 * @param {string} otp - OTP code
 * @returns {Promise} Response
 */
export const verifyOTP = async (email, otp) => {
  try {
    const response = await httpClient.post(API.VERIFY_OTP, { email, otp });
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

/**
 * Reset password
 * @param {object} resetData - Reset data with email, otp, and newPassword
 * @returns {Promise} Response
 */
export const resetPassword = async (resetData) => {
  try {
    const response = await httpClient.post(API.RESET_PASSWORD, resetData);
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};