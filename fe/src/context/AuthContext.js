import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken } from '../service/localStorageService';
import { getUserFromToken, isTokenValid } from '../utils/jwtUtils';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);

  const updateUserInfo = () => {
    const token = getToken();
    if (token && isTokenValid(token)) {
      const user = getUserFromToken(token);
      setUserInfo(user);
    } else {
      setUserInfo(null);
    }
  };

  useEffect(() => {
    updateUserInfo();
  }, []);

  const value = {
    userInfo,
    isLoggedIn: userInfo !== null,
    isAdmin: userInfo?.role === 'ADMIN',
    updateUserInfo
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
