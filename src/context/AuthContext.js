import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
  const tg = window.Telegram.WebApp;
  tg.ready();

  const initData = tg.initData;
  if (initData) {
    api.post('auth/telegram/', { init_data: initData })
      .then(res => {
        setToken(res.data.access);
        localStorage.setItem('token', res.data.access);

        const params = new URLSearchParams(initData);
        const userStr = params.get('user');
        if (userStr) {
          try {
            setUser(JSON.parse(userStr.replace(/'/g, '"')));
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      })
      .catch(() => alert('Ошибка авторизации через Telegram'));
    }
  }, []);


  // Функция для обновления access-токена по refresh-токену
  const refreshAccessToken = async () => {
    if (!refreshToken) return;

    try {
      const res = await api.post('token/refresh/', { refresh: refreshToken });
      setToken(res.data.access);
      localStorage.setItem('token', res.data.access);
    } catch {
      logout(); // Если refresh не удался — логаутим
    }
  };

  const logout = () => {
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
  };

  return (
    <AuthContext.Provider value={{ token, user, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
