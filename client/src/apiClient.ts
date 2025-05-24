import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // או ה-URL של ה-API שלך מ-process.env
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// אפשר להוסיף כאן גם interceptor לתגובות, למשל לטיפול בשגיאות 401 גלובליות
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // אם מקבלים 401, אולי הטוקן לא תקף או פג תוקף
      // אפשר לנקות את הטוקן ולנתק את המשתמש
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      // אפשר לנווט לדף התחברות, אבל זה ידרוש גישה ל-navigate
      // window.location.href = '/login'; // פתרון פשוט אך פחות אלגנטי
      console.error("Unauthorized request or token expired. Logging out.");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
