import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { saveToken, getToken, removeToken } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: restore session from token
  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          const res = await authService.getMe();
          setUser(res.data.data);
        }
      } catch {
        await removeToken();
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    const { token, user: userData } = res.data.data;
    await saveToken(token);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    const res = await authService.register(name, email, password);
    const { token, user: userData } = res.data.data;
    await saveToken(token);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    await removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isLoggedIn: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
