// client/src/components/AiRecipeRequestSection.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  LinearProgress
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface AiRecipeRequestSectionProps {
  aiCriteria: string;
  setAiCriteria: (criteria: string) => void;
  handleRequestRecipeFromAI: () => Promise<void>;
  isGeneratingAiRecipe: boolean;
  aiError: string | null;
}

const AiRecipeRequestSection: React.FC<AiRecipeRequestSectionProps> = ({
  aiCriteria,
  setAiCriteria,
  handleRequestRecipeFromAI,
  isGeneratingAiRecipe,
  aiError,
}) => {
  const { t } = useTranslation();
  const [messageIndex, setMessageIndex] = useState(0);

  const loadingMessages = t('ai.loadingMessages', { returnObjects: true }) as string[];

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isGeneratingAiRecipe) {
      interval = setInterval(() => {
        setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
      }, 4500);
    } else {
      setMessageIndex(0);
    }

    return () => clearInterval(interval);
  }, [isGeneratingAiRecipe]);

  return (
    <Box sx={(theme) => ({
      mb: 3,
      p: 2,
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 2,
      bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#f9f9f9',
      position: 'relative',
      overflow: 'hidden'
    })}>

      {/* פס התקדמות עליון שמופיע רק בזמן ג'ינרוט */}
      {isGeneratingAiRecipe && (
        <LinearProgress
          color="secondary"
          sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4 }}
        />
      )}

      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AutoAwesomeIcon color="secondary" />
        {t('ai.sectionTitle')}
      </Typography>

      <TextField
        fullWidth
        label={t('ai.inputLabel')}
        variant="outlined"
        value={aiCriteria}
        onChange={(e) => setAiCriteria(e.target.value)}
        sx={{
          mb: 2,
          bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'white'
        }}
        disabled={isGeneratingAiRecipe}
      />

      <Button
        variant="contained"
        color="secondary"
        startIcon={isGeneratingAiRecipe ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
        onClick={handleRequestRecipeFromAI}
        fullWidth
        disabled={isGeneratingAiRecipe}
        sx={{
          py: 1.5,
          fontSize: '1.1rem',
          fontWeight: 'bold',
          transition: 'all 0.4s ease',
          boxShadow: isGeneratingAiRecipe ? 0 : 3,
          animation: isGeneratingAiRecipe ? 'pulse 2.5s infinite' : 'none',
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(0.98)', opacity: 0.9 },
            '100%': { transform: 'scale(1)' },
          }
        }}
      >
        {isGeneratingAiRecipe ? loadingMessages[messageIndex] : t('ai.requestButton')}
      </Button>

      {aiError && (
        <Typography
          color="error"
          variant="body2"
          sx={(theme) => ({
            mt: 1.5,
            textAlign: 'center',
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(211, 47, 47, 0.1)' : '#ffebee',
            p: 1,
            borderRadius: 1,
            border: theme.palette.mode === 'dark' ? '1px solid rgba(211, 47, 47, 0.3)' : 'none'
          })}
        >
          {aiError}
        </Typography>
      )}

      <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary', textAlign: 'center', fontStyle: 'italic' }}>
        {t('ai.privacyNote')}
      </Typography>
    </Box>
  );
};

export default AiRecipeRequestSection;