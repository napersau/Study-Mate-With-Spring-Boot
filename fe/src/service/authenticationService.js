import axios from "axios";
import httpClient from "../config/httpClient";
import { API, CONFIG } from "../config/configuration";
import { setToken, removeToken } from "./localStorageService";

/**
 * Login with email and password
 * @param {string} username - User email or username
 * @param {string} password - User password
 * @returns {Promise} Login response with token
 */
export const login = async (username, password) => {
  try {
    const response = await httpClient.post(API.LOGIN, {
      username,
      password,
    });
    
    if (response.data && response.data.result && response.data.result.token) {
      setToken(response.data.result.token);
    }
    
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

/**
 * Register new user
 * @param {object} userData - User registration data
 * @returns {Promise} Registration response
 */
export const register = async (userData) => {
  try {
    const response = await httpClient.post(API.REGISTER, userData);
    return response.data;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};

/**
 * Logout user
 */
export const logOut = () => {
  removeToken();
  window.location.href = "/login";
};

/**
 * Redirect browser to Spring Boot's Google OAuth2 endpoint
 */
export const redirectToGoogle = () => {
  window.location.href = `${CONFIG.API_GATEWAY.replace("/api/v1", "")}/oauth2/authorization/google`;
};

/**
 * Called after Spring Boot redirects back to /auth/signingoogle.
 * Sends the session cookie so Spring can resolve the OAuth2 user and return a JWT.
 */
export const loginWithGoogle = async () => {
  try {
    const response = await axios.post(
      `${CONFIG.API_GATEWAY}/auth/signingoogle`,
      {},
      { withCredentials: true }
    );

    if (response.data && response.data.result && response.data.result.token) {
      setToken(response.data.result.token);
    }

    return response.data;
  } catch (error) {
    console.error("Error during Google login:", error);
    throw error;
  }
};