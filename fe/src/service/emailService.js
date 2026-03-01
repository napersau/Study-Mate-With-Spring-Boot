import httpClient from "../config/httpClient";
import { API } from "../config/configuration";

/**
 * Gửi OTP về email để đặt lại mật khẩu
 * @param {string} email - Email của người dùng
 * @returns {Promise} API response
 */
export const sendForgotPasswordOtp = async (email) => {
  try {
    const response = await httpClient.post(API.FORGOT_PASSWORD, { email });
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

/**
 * Xác thực mã OTP
 * @param {string} email - Email của người dùng
 * @param {string} otp - Mã OTP nhận được
 * @returns {Promise} API response
 */
export const verifyPasswordOtp = async (email, otp) => {
  try {
    const response = await httpClient.post(API.VERIFY_OTP, { email, otp });
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

/**
 * Đặt lại mật khẩu mới
 * @param {string} email - Email của người dùng
 * @param {string} otp - Mã OTP đã xác thực
 * @param {string} newPassword - Mật khẩu mới
 * @returns {Promise} API response
 */
export const resetPassword = async (email, otp, newPassword) => {
  try {
    const response = await httpClient.post(API.RESET_PASSWORD, { email, otp, newPassword });
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};
