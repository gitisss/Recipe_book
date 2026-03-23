import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  LinearProgress,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import type { IAICriteria } from '../hooks/useAIRecipeGeneration';

interface AiRecipeRequestSectionProps {
  aiCriteria: IAICriteria;
  setAiCriteria: React.Dispatch<React.SetStateAction<IAICriteria>>;
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

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

  const handleChange = (field: keyof IAICriteria) => (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    setAiCriteria(prev => ({ ...prev, [field]: e.target.value as string }));
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Button
        variant="outlined"
        color="secondary"
        fullWidth
        onClick={() => setIsExpanded(!isExpanded)}
        startIcon={<AutoAwesomeIcon />}
        endIcon={isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        sx={{
          py: 1.5,
          mb: isExpanded ? 0 : 2,
          borderStyle: 'dashed',
          borderRadius: isExpanded ? '16px 16px 0 0' : '16px',
          fontWeight: 'bold',
          transition: 'all 0.3s ease'
        }}
      >
        {t('ai.toggleButton', 'יצירת מתכון באמצעות AI')}
      </Button>

      <Collapse in={isExpanded || isGeneratingAiRecipe}>
        <Box sx={(theme) => ({
          p: 3,
          border: '1px solid',
          borderColor: 'secondary.main',
          borderTop: 'none',
          borderRadius: '0 0 16px 16px',
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(156, 39, 176, 0.05)' : 'rgba(156, 39, 176, 0.03)',
          position: 'relative',
          overflow: 'hidden'
        })}>

          {isGeneratingAiRecipe && (
            <LinearProgress
              color="secondary"
              sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4 }}
            />
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
            <Box>
              <TextField
                fullWidth
                label={t('ai.freeTextField', 'בקשה חופשית')}
                placeholder={t('ai.inputLabel', 'מה נבשל היום? עוגת שוקולד טבעונית, או אולי משהו עם פטריות ושמנת?')}
                value={aiCriteria.freeText}
                onChange={handleChange('freeText')}
                disabled={isGeneratingAiRecipe}
                variant="outlined"
                multiline
                rows={3}
                InputProps={{
                  sx: { fontSize: '1.1rem', bgcolor: 'background.paper' }
                }}
              />
            </Box>

            <Box display="flex" justifyContent="center">
              <Button 
                size="small" 
                variant="text" 
                color="secondary"
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                endIcon={isAdvancedOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                disabled={isGeneratingAiRecipe}
              >
                {t('ai.advancedSettings', 'הגדרות מתקדמות (סינון ספציפי)')}
              </Button>
            </Box>

            <Collapse in={isAdvancedOpen}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, p: 2, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)', borderRadius: 2 }}>
                
                <Box>
                  <TextField
                    fullWidth
                    label={t('ai.ingredientsField', 'מצרכים זמינים')}
                    placeholder={t('ai.ingredientsPlaceholder', 'לדוגמה: עגבניות, ביצים, בצל')}
                    value={aiCriteria.ingredients}
                    onChange={handleChange('ingredients')}
                    disabled={isGeneratingAiRecipe}
                    variant="outlined"
                    size="small"
                    sx={{ bgcolor: 'background.paper' }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <FormControl fullWidth size="small" sx={{ bgcolor: 'background.paper' }}>
                    <InputLabel>{t('ai.dietField', 'תזונה')}</InputLabel>
                    <Select
                      value={aiCriteria.diet}
                      label={t('ai.dietField', 'תזונה')}
                      onChange={(e) => handleChange('diet')(e as any)}
                      disabled={isGeneratingAiRecipe}
                    >
                      <MenuItem value="">{t('ai.any', 'הכל')}</MenuItem>
                      <MenuItem value="טבעוני">{t('dietary.vegan', 'טבעוני')}</MenuItem>
                      <MenuItem value="צמחוני">{t('dietary.vegetarian', 'צמחוני')}</MenuItem>
                      <MenuItem value="ללא גלוטן">{t('dietary.glutenFree', 'ללא גלוטן')}</MenuItem>
                      <MenuItem value="קטו">קטו</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small" sx={{ bgcolor: 'background.paper' }}>
                    <InputLabel>{t('ai.cuisineField', 'מטבח')}</InputLabel>
                    <Select
                      value={aiCriteria.cuisine}
                      label={t('ai.cuisineField', 'מטבח')}
                      onChange={(e) => handleChange('cuisine')(e as any)}
                      disabled={isGeneratingAiRecipe}
                    >
                      <MenuItem value="">{t('ai.any', 'הכל')}</MenuItem>
                      <MenuItem value="ישראלי">{t('cuisines.israeli', 'ישראלי')}</MenuItem>
                      <MenuItem value="איטלקי">{t('cuisines.italian', 'איטלקי')}</MenuItem>
                      <MenuItem value="אסייתי">{t('cuisines.asian', 'אסייתי')}</MenuItem>
                      <MenuItem value="מזרח תיכוני">{t('cuisines.middleEastern', 'מזרח תיכוני')}</MenuItem>
                      <MenuItem value="אמריקאי">{t('cuisines.american', 'אמריקאי')}</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <FormControl fullWidth size="small" sx={{ bgcolor: 'background.paper' }}>
                    <InputLabel>{t('ai.mealTypeField', 'סוג ארוחה')}</InputLabel>
                    <Select
                      value={aiCriteria.mealType}
                      label={t('ai.mealTypeField', 'סוג ארוחה')}
                      onChange={(e) => handleChange('mealType')(e as any)}
                      disabled={isGeneratingAiRecipe}
                    >
                      <MenuItem value="">{t('ai.any', 'הכל')}</MenuItem>
                      <MenuItem value="ארוחת בוקר">{t('categories.breakfast', 'ארוחת בוקר')}</MenuItem>
                      <MenuItem value="ארוחת צהריים">ארוחת צהריים</MenuItem>
                      <MenuItem value="ארוחת ערב">ארוחת ערב</MenuItem>
                      <MenuItem value="קינוח">{t('categories.dessert', 'קינוח')}</MenuItem>
                      <MenuItem value="נשנוש">נשנוש</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small" sx={{ bgcolor: 'background.paper' }}>
                    <InputLabel>{t('ai.moodField', 'סגנון/אווירה')}</InputLabel>
                    <Select
                      value={aiCriteria.mood}
                      label={t('ai.moodField', 'סגנון/אווירה')}
                      onChange={(e) => handleChange('mood')(e as any)}
                      disabled={isGeneratingAiRecipe}
                    >
                      <MenuItem value="">{t('ai.any', 'הכל')}</MenuItem>
                      <MenuItem value="מהיר וקל">מהיר וקל</MenuItem>
                      <MenuItem value="מנחם">מנחם (Comfort food)</MenuItem>
                      <MenuItem value="בריא">בריא ומזין</MenuItem>
                      <MenuItem value="חגיגי">חגיגי</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Collapse>
          </Box>

          <Button
            variant="contained"
            color="secondary"
            startIcon={isGeneratingAiRecipe ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
            onClick={() => {
              handleRequestRecipeFromAI().then(() => {
                // Keep expanded while generating, then collapse when done/accepted
              });
            }}
            fullWidth
            disabled={isGeneratingAiRecipe}
            sx={{
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: '8px',
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
      </Collapse>
    </Box>
  );
};

export default AiRecipeRequestSection;