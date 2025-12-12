// Configuration from environment variables
export const CONFIG = {
  API_GATEWAY: process.env.REACT_APP_API_GATEWAY || "http://localhost:8080/api/v1",
  APP_NAME: process.env.REACT_APP_NAME || "Study Mate",
  APP_DESCRIPTION: process.env.REACT_APP_DESCRIPTION || "English Learning Platform",
};

// API Endpoints
export const API = {
  // Authentication
  LOGIN: "/auth/token",
  LOGOUT: "/auth/logout",
  REGISTER: "/users",
  
  // User
  MY_INFO: "/users/my-info",
  GET_USER: (userId) => `/users/${userId}`,
  GET_ALL_USERS: "/users",
  SEARCH_USER: "/users/search",
  
  // Profile
  UPDATE_PROFILE: "/profile/users/my-profile",
  UPDATE_AVATAR: "/profile/users/avatar",
  
  // User Management
  TOGGLE_ACTIVE_USER: "/users/update",
  
  // Password
  FORGOT_PASSWORD: "/email/forgot-password",
  VERIFY_OTP: "/email/verify-otp",
  RESET_PASSWORD: "/email/reset-password",
  
  // Flashcards
  FLASHCARDS: "/flashcards",
  
};