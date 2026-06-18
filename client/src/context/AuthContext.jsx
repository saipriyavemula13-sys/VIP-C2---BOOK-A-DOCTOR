import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('bookadoctor-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('bookadoctor-token') || '');

  useEffect(() => {
    if (user) localStorage.setItem('bookadoctor-user', JSON.stringify(user));
    else localStorage.removeItem('bookadoctor-user');
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem('bookadoctor-token', token);
    else localStorage.removeItem('bookadoctor-token');
  }, [token]);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken('');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
