// client/src/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // ודא שהמפתח כאן תואם את מה שנשמר בלוגין
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // אם מקבלים 401, אולי הטוקן לא תקף או פג תוקף
      // אפשר לנקות את הטוקן ולנתק את המשתמש
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      // שימו לב: כאן אין ניווט אוטומטי, רק הודעה לקונסול
      console.error("Unauthorized request or token expired. Logging out.");
      // כאן ניתן להפעיל ניתוק וניווט ידני אם רוצים, אך זה מחוץ לסקופ הקומפוננטה הנוכחית
    }
    return Promise.reject(error);
  }
);

export default apiClient;