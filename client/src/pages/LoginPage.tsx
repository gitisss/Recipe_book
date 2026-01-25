import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Paper, TextField, Button, Typography, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import apiClient from '../apiClient';

// הגדרת מבנה לנתוני משתמש, כדי שהטיפוס יהיה ברור יותר
interface UserData {
  id: string;
  username: string;
  // הוסף כאן שדות נוספים אם המשתמש אובייקט כולל אותם (למשל email, role וכו')
}

// הגדרת מבנה ל-props שהקומפוננטה מקבלת
interface LoginPageProps {
  onLoginSuccess: (token: string, userData: UserData) => void;
}

const StyledFormContainer = styled(Paper)(({ theme }) => ({
  maxWidth: 400,
  margin: '2rem auto',
  padding: '2rem',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  textAlign: 'center',
}));

const StyledForm = styled('form')(({ theme }) => ({
  '& .form-group': {
    marginBottom: '1rem',
    textAlign: 'right',
  },
  '& label': {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    color: theme.palette.text.primary,
  },
}));

const StyledFormControl = styled(TextField)(() => ({
  width: '100%',
  textAlign: 'right',
  '& .MuiInputBase-input': {
    textAlign: 'right',
  },
}));

const StyledSubmitButton = styled(Button)(() => ({
  width: '100%',
  padding: '0.75rem',
  marginTop: '1rem',
}));

const StyledFormLink = styled(Typography)(({ theme }) => ({
  marginTop: '1.5rem',
  fontSize: '0.9rem',
  '& a': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // הודעות למשתמש (הצלחה/שגיאה)
  const [isLoading, setIsLoading] = useState(false); // מצב טעינה עבור הכפתור
  const navigate = useNavigate(); // Hook לניווט בין דפים

  // פונקציה לטיפול בשליחת טופס ההתחברות
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // מונע ריענון דף בברירת מחדל של טופס HTML

    setIsLoading(true); // הפעל מצב טעינה
    setMessage(''); // נקה הודעות קודמות

    try {
      // שליחת בקשת POST לנקודת הקצה של ההתחברות בשרת
      const response = await apiClient.post('/logIn', { username, password });

      // אם ההתחברות הצליחה וקיבלנו טוקן
      if (response.data && response.data.token && response.data.user) {
        setMessage(t('auth.loginSuccess'));
        // שמירת הטוקן ופרטי המשתמש ב-localStorage
        localStorage.setItem('authToken', response.data.token); // המפתח 'authToken' צריך להיות תואם למה ש-apiClient מצפה לו
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));

        // קריאה לפונקציית ההצלחה שהועברה כ-prop מ-App.tsx
        onLoginSuccess(response.data.token, response.data.user);

        // ניווט לדף לוח הבקרה לאחר התחברות מוצלחת
        navigate('/dashboard');
      } else {
        // אם השרת החזיר תגובה ללא טוקן או משתמש, אך ללא שגיאה מפורשת
        setMessage(t('auth.loginFailed'));
      }
    } catch (error: any) {
      // טיפול בשגיאות מה-API (לדוגמה, שגיאות 400, 401, שגיאות רשת)
      console.error('Login error:', error);
      if (error.response) {
        // שגיאה מהשרת עם תגובה ספציפית
        setMessage(error.response.data.message || t('auth.unexpectedError'));
      } else if (error.request) {
        // הבקשה נשלחה אך לא התקבלה תגובה (למשל, השרת לא זמין)
        setMessage(t('auth.networkError'));
      } else {
        // שגיאות אחרות
        setMessage(t('auth.unexpectedError'));
      }
    } finally {
      setIsLoading(false); // כבה מצב טעינה
    }
  };

  const isError = message === t('auth.loginFailed') || message === t('auth.networkError') || message === t('auth.unexpectedError');

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main}11 0%, ${theme.palette.primary.dark}22 100%)`,
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '60%',
        height: '60%',
        background: 'radial-gradient(circle, rgba(30,136,229,0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 20s infinite ease-in-out',
        zIndex: 0,
      },
      '@keyframes float': {
        '0%': { transform: 'translate(0, 0) scale(1)' },
        '50%': { transform: 'translate(-5%, 10%) scale(1.05)' },
        '100%': { transform: 'translate(0, 0) scale(1)' },
      }
    }}>
      <StyledFormContainer elevation={3} sx={{
        position: 'relative',
        zIndex: 1,
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.01)',
          boxShadow: (theme) => `0 12px 40px ${theme.palette.primary.main}22`,
        }
      }}>
        <Typography variant="h4" component="h2" gutterBottom>
          {t('auth.login')}
        </Typography>
        <StyledForm onSubmit={handleSubmit}>
          <Box className="form-group">
            <StyledFormControl
              label={t('auth.username')}
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
              margin="normal"
            />
          </Box>
          <Box className="form-group">
            <StyledFormControl
              label={t('auth.password')}
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              margin="normal"
            />
          </Box>
          <StyledSubmitButton
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? t('auth.loggingIn') : t('auth.loginButton')}
          </StyledSubmitButton>
        </StyledForm>
        {message && (
          <Alert severity={isError ? 'error' : 'success'} sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
        <StyledFormLink>
          {t('auth.noAccount')} <Link to="/signup">{t('auth.registerHere')}</Link>
        </StyledFormLink>
      </StyledFormContainer>
    </Box>
  );
};

export default LoginPage;