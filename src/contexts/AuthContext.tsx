import React, { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  date_of_birth?: string;
  location?: string;
  county?: string;
  created_at: string;
  last_login?: string;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user storage for development
const mockUsers: Record<string, { email: string; password: string; user: User }> = {};

const createMockUser = (email: string, fullName: string): User => ({
  id: Math.random() * 1000,
  email,
  full_name: fullName,
  created_at: new Date().toISOString(),
  is_active: true,
});

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchCurrentUser(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (token: string) => {
    try {
      if (USE_MOCK_API) {
        const userData = localStorage.getItem(`user_${token}`);
        if (userData) {
          const user = JSON.parse(userData);
          setUser(user);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('authToken');
          setIsAuthenticated(false);
        }
      } else {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('authToken');
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (USE_MOCK_API) {
        // Mock login
        const userKey = `${email}_${password}`;
        if (mockUsers[userKey]) {
          const userData = mockUsers[userKey].user;
          const token = `token_${Date.now()}`;
          localStorage.setItem('authToken', token);
          localStorage.setItem(`user_${token}`, JSON.stringify(userData));
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          throw new Error('Invalid email or password');
        }
      } else {
        const response = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Login failed');
        }

        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    try {
      if (USE_MOCK_API) {
        // Mock registration
        const userKey = `${email}_${password}`;
        if (mockUsers[userKey]) {
          throw new Error('Email already registered');
        }
        const userData = createMockUser(email, fullName);
        mockUsers[userKey] = { email, password, user: userData };
        
        const token = `token_${Date.now()}`;
        localStorage.setItem('authToken', token);
        localStorage.setItem(`user_${token}`, JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        const response = await fetch(`${API_URL}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, full_name: fullName }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Registration failed');
        }

        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      localStorage.removeItem(`user_${token}`);
    }
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (profile: Partial<User>) => {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No authentication token');

    try {
      if (USE_MOCK_API) {
        const userData = localStorage.getItem(`user_${token}`);
        if (userData) {
          const user = JSON.parse(userData);
          const updatedUser = { ...user, ...profile };
          localStorage.setItem(`user_${token}`, JSON.stringify(updatedUser));
          setUser(updatedUser);
        }
      } else {
        const response = await fetch(`${API_URL}/api/auth/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profile),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Profile update failed');
        }

        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
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
