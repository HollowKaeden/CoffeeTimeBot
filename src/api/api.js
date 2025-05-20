import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем токен к каждому запросу
api.interceptors.request.use(config => {
  if (config.url !== 'auth/telegram/') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Обработка ошибок ответа — если 401, пытаемся обновить токен и повторить запрос
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Защита от зацикливания
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        // Если refresh-токена нет — просто отклоняем ошибку
        return Promise.reject(error);
      }

      try {
        // Запрос на обновление токена
        const response = await axios.post('http://localhost:8000/api/token/refresh/', {
          refresh: refreshToken,
        });

        // Сохраняем новый access-токен
        localStorage.setItem('token', response.data.access);

        // Обновляем заголовок у исходного запроса
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

        // Повторяем исходный запрос с новым токеном
        return axios(originalRequest);
      } catch (refreshError) {
        // Если обновление не удалось — очищаем авторизацию и редиректим (например, на логин)
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login'; // или другое действие
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
