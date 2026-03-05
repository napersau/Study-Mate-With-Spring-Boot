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
 *
 * Spring Boot's OAuth2 success handler typically embeds the JWT directly
 * in the redirect URL as a query parameter, e.g.:
 *   http://localhost:3000/auth/signingoogle?token=eyJhbGc...
 *
 * This function reads that token from the URL. If the token is not present
 * in the URL (e.g. session-based flow), it falls back to a POST request
 * to the backend.
 *
 * @param {string} [searchParams] - window.location.search from the callback page
 * @returns {Promise<{code: number, result: {token: string}}>}
 */
export const loginWithGoogle = async (searchParams = "") => {
  // --- Primary: token embedded in redirect URL ---
  const params = new URLSearchParams(searchParams);
  const token = params.get("token");
  const code = params.get("code");  // Spring Boot may send an auth code instead

  console.log("[loginWithGoogle] parsed token:", token);
  console.log("[loginWithGoogle] parsed code:", code);

  if (token) {
    setToken(token);
    // Return a shape consistent with the rest of the app
    return { code: 1000, result: { token } };
  }

  // --- Fallback: session-cookie based exchange, optionally passing the code ---
  try {
    const body = code ? { code } : {};
    const response = await axios.post(
      `${CONFIG.API_GATEWAY}/auth/signingoogle`,
      body,
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