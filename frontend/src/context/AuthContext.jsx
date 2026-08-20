import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Invalid stored user data');

        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }

    setLoading(false);
  }, []);

  // LOGIN
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });

      const {
        accessToken,
        username,
        email: userEmail,
        role
      } = response.data;

      const userData = {
        username,
        email: userEmail,
        role
      };

      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);

      return {
        success: true
      };

    } catch (error) {

      const message =
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please check your credentials.';

      return {
        success: false,
        error: message
      };
    }
  };

  // REGISTER
  const register = async (
    username,
    email,
    password,
    confirmPassword
  ) => {
    try {

      const response = await api.post('/auth/register', {
        username,
        email,
        password,
        confirmPassword
      });

      return {
        success: true,
        message:
          response.data.message ||
          'Registered successfully!'
      };

    } catch (error) {

      const message =
        error.response?.data?.message ||
        error.message ||
        'Registration failed.';

      return {
        success: false,
        error: message
      };
    }
  };

  // LOGOUT
  const logout = () => {

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setUser(null);
  };

  // ROLE HELPERS
  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  const isAdmin = user?.role === 'ADMIN';
  const isHR = user?.role === 'HR';
  const isEmployee = user?.role === 'EMPLOYEE';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,

        isAuthenticated: !!user,

        hasRole,
        hasAnyRole,

        isAdmin,
        isHR,
        isEmployee
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
};