import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Paper, TextField, Button, Typography, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';

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
      setMessage('הסיסמאות אינן תואמות.');
      return;
    }

    if (password.length < 6) {
        setMessage('הסיסמה חייבת להכיל לפחות 6 תווים.');
        return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/signup', {
        username,
        password,
      });
      setMessage(response.data.message || 'ההרשמה בוצעה בהצלחה!');
      setTimeout(() => {
        navigate('/login');
      }, 2000); // השהייה של 2 שניות
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.message || 'אירעה שגיאה בתהליך ההרשמה.');
      } else {
        setMessage('אירעה שגיאה לא צפויה בתהליך ההרשמה.');
      }
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isError = message.startsWith('אירעה שגיאה') || message.startsWith('הסיסמאות');

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', bgcolor: 'background.default' }}>
      <StyledFormContainer elevation={3}>
        <Typography variant="h4" component="h2" gutterBottom>
          הרשמה
        </Typography>
        <StyledForm onSubmit={handleSubmit}>
          <Box className="form-group">
            <StyledFormControl
              label="שם משתמש"
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
              label="סיסמה"
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
              label="אימות סיסמה"
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
            {isLoading ? 'שולח...' : 'הירשם'}
          </StyledSubmitButton>
        </StyledForm>
        {message && (
          <Alert severity={isError ? 'error' : 'success'} sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
        <StyledFormLink>
          כבר יש לך חשבון? <Link to="/login">התחבר כאן</Link>
        </StyledFormLink>
      </StyledFormContainer>
    </Box>
  );
};

export default SignUpPage;
