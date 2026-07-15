import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/auth.service';
import type { UserProfile } from '../services/auth.service';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to decode JWT and get expiration time
const getTokenExpirationTime = (token: string): number => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    return decoded.exp ? decoded.exp * 1000 : 0;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return 0;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    checkAuth();
    setupTokenRefreshTimer();

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  const setupTokenRefreshTimer = () => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (!token) return;

    const expirationTime = getTokenExpirationTime(token);
    const now = Date.now();
    const timeUntilExpiry = expirationTime - now;

    // Refresh token 5 minutes before expiry
    const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 1000);

    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }

    refreshIntervalRef.current = setInterval(() => {
      attemptTokenRefresh();
    }, refreshTime);
  };

  const attemptTokenRefresh = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
      if (refreshToken) {
        const response = await authService.refreshToken(refreshToken);
        const { access_token, refresh_token } = response;
        
        if (localStorage.getItem('refresh_token')) {
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
        } else {
          sessionStorage.setItem('access_token', access_token);
          sessionStorage.setItem('refresh_token', refresh_token);
        }

        setupTokenRefreshTimer();
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  };

  const checkAuth = async () => {
    try {
      if (authService.isAuthenticated()) {
        const userData = authService.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
        
        // Optionally fetch fresh profile data
        try {
          const profile = await authService.getProfile();
          setUser(profile);
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    const response = await authService.login(email, password, rememberMe);
    setUser(response.user as any);
    setIsAuthenticated(true);
    setupTokenRefreshTimer();
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }
  };

  const refreshAuth = async () => {
    await checkAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
