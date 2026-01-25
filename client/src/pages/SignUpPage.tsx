import React, { useState } from 'react';
import apiClient from '../apiClient';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Paper, TextField, Button, Typography, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

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

const SignUpPage: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(''); // איפוס הודעה קודמת

    if (password !== confirmPassword) {
      setMessage(t('auth.passwordsDoNotMatch'));
      return;
    }

    if (password.length < 6) {
      setMessage(t('auth.passwordTooShort'));
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post('/signup', {
        username,
        password,
      });
      setMessage(response.data.message || t('auth.signupSuccess'));
      setTimeout(() => {
        navigate('/login');
      }, 2000); // השהייה של 2 שניות
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.message || t('auth.signupFailed'));
      } else {
        setMessage(t('auth.unexpectedError'));
      }
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isError = message !== t('auth.signupSuccess');

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', bgcolor: 'background.default' }}>
      <StyledFormContainer elevation={3}>
        <Typography variant="h4" component="h2" gutterBottom>
          {t('auth.signup')}
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
          <Box className="form-group">
            <StyledFormControl
              label={t('auth.confirmPassword')}
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {isLoading ? t('auth.signingUp') : t('auth.signupButton')}
          </StyledSubmitButton>
        </StyledForm>
        {message && (
          <Alert severity={isError ? 'error' : 'success'} sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
        <StyledFormLink>
          {t('auth.hasAccount')} <Link to="/login">{t('auth.loginHere')}</Link>
        </StyledFormLink>
      </StyledFormContainer>
    </Box>
  );
};

export default SignUpPage;
