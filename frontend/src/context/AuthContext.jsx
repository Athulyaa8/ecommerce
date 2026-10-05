import React, { createContext, useContext, useState } from 'react';
import { loginUser } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('ecommerce_token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ecommerce_user');
    return saved ? JSON.parse(saved) : null;
  });

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN';

  const login = async (email, password) => {
    const res = await loginUser(email, password);
    const jwtToken = res.token;
    const userData = {
      email: res.email,
      name: res.name,
      role: res.role,
    };

    setToken(jwtToken);
    setUser(userData);
    localStorage.setItem('ecommerce_token', jwtToken);
    localStorage.setItem('ecommerce_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ecommerce_token');
    localStorage.removeItem('ecommerce_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
