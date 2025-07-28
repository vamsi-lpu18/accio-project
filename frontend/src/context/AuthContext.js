"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      const token = localStorage.getItem('accio-token');
      const authState = !!token;
      console.log('🔐 AuthContext: Checking auth, token exists:', !!token);
      setIsLoggedIn(authState);
      setLoading(false);
    };

    checkAuth();

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'accio-token') {
        console.log('🔐 AuthContext: Storage changed for accio-token');
        checkAuth();
      }
    };

    // Listen for custom auth events
    const handleAuthEvent = () => {
      console.log('🔐 AuthContext: Custom auth event received');
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChanged', handleAuthEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthEvent);
    };
  }, []);

  const login = (token) => {
    console.log('🔐 AuthContext: Login called with token:', !!token);
    localStorage.setItem('accio-token', token);
    setIsLoggedIn(true);
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('authStateChanged'));
  };

  const logout = () => {
    console.log('🔐 AuthContext: Logout called');
    localStorage.removeItem('accio-token');
    setIsLoggedIn(false);
    setUser(null);
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('authStateChanged'));
  };

  const value = {
    isLoggedIn,
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 