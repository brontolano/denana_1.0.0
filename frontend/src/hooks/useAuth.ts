import { useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const { user, token, isAuthenticated, login, logout } = useAuthStore();
  
  const checkAuth = useCallback(() => {
    if (!token) return;
    try {
      const decoded = decodeToken(token);
      if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
        logout();
      }
    } catch {
      logout();
    }
  }, [token, logout]);
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    decodeToken: (t: string) => {
      try { 
        const parts = t.split('.');
        const payload = JSON.parse(atob(parts[1]));
        return payload; 
      } catch { return null; }
    }
  };
};

const decodeToken = (token: string) => {
  try {
    const parts = token.split('.');
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch {
    return null;
  }
};
