// client/src/components/AiRecipeRequestSection.tsx
import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress // ייבוא חדש לטעינה
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'; // אייקון ל-AI

// הגדרת הממשק עבור ה-props של הקומפוננטה החדשה
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
  return (
    <Box sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, bgcolor: '#f9f9f9' }}>
      <Typography variant="h6" gutterBottom>
        בקש מתכון מה-AI שלנו
      </Typography>
      <TextField
        fullWidth
        label="קריטריונים למתכון (לדוגמה: עוף, אורז, קל, צמחוני, ארוחת ערב)"
        variant="outlined"
        value={aiCriteria}
        onChange={(e) => setAiCriteria(e.target.value)}
        sx={{ mb: 2 }}
        disabled={isGeneratingAiRecipe}
      />
      <Button
        variant="outlined"
        color="secondary"
        startIcon={isGeneratingAiRecipe ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
        onClick={handleRequestRecipeFromAI}
        fullWidth
        disabled={isGeneratingAiRecipe}
      >
        {isGeneratingAiRecipe ? 'מייצר מתכון...' : 'בקש מתכון מה-AI שלנו'}
      </Button>
      {aiError && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {aiError}
        </Typography>
      )}
      <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
        המתכון שיווצר ימלא אוטומטית את שדות הטופס.
      </Typography>
    </Box>
  );
};

export default AiRecipeRequestSection;