import React from 'react';
import { Box, Button, Typography, Container, Grid, Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SearchIcon from '@mui/icons-material/Search';
import PaletteIcon from '@mui/icons-material/Palette';

const HomePage: React.FC<{ isAuthenticated: boolean }> = ({ isAuthenticated }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleCTA = () => {
        if (isAuthenticated) {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    };

    return (
        <Box sx={{
            height: 'calc(100vh - 100px)', // Precise fit for one screen (Header approx 56px, Footer approx 44px)
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            {/* Hero Section - Balanced flex */}
            <Box sx={(theme) => ({
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}88 0%, ${theme.palette.primary.dark}88 100%)`,
                color: theme.palette.primary.contrastText,
                textAlign: 'center',
                borderRadius: '0 0 40px 40px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-15%',
                    left: '-10%',
                    width: '45%',
                    height: '65%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
                    borderRadius: '50%',
                    animation: 'float-rich 12s infinite ease-in-out',
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-15%',
                    right: '-10%',
                    width: '55%',
                    height: '75%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    animation: 'float-rich 18s infinite ease-in-out reverse',
                },
                '@keyframes float-rich': {
                    '0%': { transform: 'translate(0, 0) scale(1) rotate(0deg)' },
                    '33%': { transform: 'translate(5%, 10%) scale(1.1) rotate(5deg)' },
                    '66%': { transform: 'translate(-5%, 5%) scale(0.95) rotate(-5deg)' },
                    '100%': { transform: 'translate(0, 0) scale(1) rotate(0deg)' },
                }
            })}>
                <Container maxWidth="md">
                    <RestaurantMenuIcon sx={{ fontSize: { xs: 40, md: 60 }, mb: 2, opacity: 0.9 }} />
                    <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '3rem' } }}>
                        {t('home.heroTitle')}
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, maxWidth: '600px', mx: 'auto', lineHeight: 1.4, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                        {t('home.heroSubtitle')}
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleCTA}
                        sx={{
                            bgcolor: 'common.white',
                            color: 'primary.main',
                            px: 4,
                            py: 1.5,
                            borderRadius: '50px',
                            fontWeight: 700,
                            '&:hover': {
                                bgcolor: 'grey.100',
                                transform: 'scale(1.05)',
                            },
                        }}
                    >
                        {isAuthenticated ? t('home.exploreDashboard') : t('home.getStarted')}
                    </Button>
                </Container>
            </Box>

            {/* Features Section - Slimmer fit */}
            <Container sx={{ py: 3, flex: '0 1 auto' }}>
                <Typography
                    variant="h5"
                    align="center"
                    gutterBottom
                    sx={{ mb: 3, fontWeight: 700, color: 'text.primary' }}
                >
                    {t('home.features.title')}
                </Typography>
                <Grid container spacing={2}>
                    {[
                        { icon: <AutoAwesomeIcon />, title: t('home.features.aiChef'), desc: t('home.features.aiChefDesc') },
                        { icon: <SearchIcon />, title: t('home.features.organize'), desc: t('home.features.organizeDesc') },
                        { icon: <PaletteIcon />, title: t('home.features.themes'), desc: t('home.features.themesDesc') }
                    ].map((feature, idx) => (
                        <Grid size={{ xs: 12, md: 4 }} key={idx}>
                            <Card sx={{
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                p: 2,
                                borderRadius: '16px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                                }
                            }}>
                                <Box sx={(theme) => ({
                                    display: 'inline-flex',
                                    p: 1.5,
                                    borderRadius: '12px',
                                    backgroundColor: theme.palette.primary.light + '22',
                                    color: theme.palette.primary.main,
                                    mr: 2,
                                })}>
                                    {feature.icon}
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                        {feature.desc}
                                    </Typography>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default HomePage;

