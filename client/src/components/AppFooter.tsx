// client/src/components/AppFooter.tsx
import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';

const AppFooter: React.FC = () => {
  return (
    <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 3, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Typography variant="body2" align="center">
          {'זכויות יוצרים © '}
          <Link color="inherit" href="https://yourwebsite.com/">
            ספר המתכונים שלי
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Container>
    </Box>
  );
};

export default AppFooter;