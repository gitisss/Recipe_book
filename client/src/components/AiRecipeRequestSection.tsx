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
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface AiRecipeRequestSectionProps {
  aiCriteria: string;
  setAiCriteria: (criteria: string) => void;
  handleRequestRecipeFromAI: () => Promise<void>;
  isGeneratingAiRecipe: boolean;
  aiError: string | null;
}

// רשימה מורחבת ומשעשעת של הודעות המתנה
const loadingMessages = [
  "מתחמם במטבח...",
  "מחפש מצרכים במזווה הווירטואלי...",
  "מנסה לתפוס את שף ה-AI שלנו לשיחה קצרה...",
  "קוצץ בצל (בלי לבכות, מבטיח)...",
  "מרתיח מים לתוצאות מושלמות...",
  "מתלבט בין מלח לתימין...",
  "טועם ומתקן תיבול...",
  "מסדר את הצלחת יפה בשבילך...",
  "מעיין בספרי בישול עתיקים...",
  "בודק מה השכנים מבשלים...",
  "מנקה את המשטח לעבודה נקייה...",
  "מחדד את הסכינים (זהירות!)...",
  "שואל את אמא של ה-AI למתכון הסודי...",
  "מחפש חלופה טבעונית לביצה דמיונית...",
  "מנסה להבין אם פטרוזיליה וכוסברה זה באמת אותו דבר...",
  "מוודא שהתנור בטמפרטורה הנכונה...",
  "מסדר את התבלינים לפי ה-א' ב'...",
  "עוד רגע והשף מוציא את המנה..."
];

const AiRecipeRequestSection: React.FC<AiRecipeRequestSectionProps> = ({
  aiCriteria,
  setAiCriteria,
  handleRequestRecipeFromAI,
  isGeneratingAiRecipe,
  aiError,
}) => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isGeneratingAiRecipe) {
      // הגדלנו את הזמן ל-4.5 שניות בין משפט למשפט
      interval = setInterval(() => {
        setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
      }, 4500); 
    } else {
      setMessageIndex(0);
    }

    return () => clearInterval(interval);
  }, [isGeneratingAiRecipe]);

  return (
    <Box sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#f9f9f9', position: 'relative', overflow: 'hidden' }}>
      
      {/* פס התקדמות עליון שמופיע רק בזמן ג'ינרוט */}
      {isGeneratingAiRecipe && (
        <LinearProgress 
          color="secondary" 
          sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4 }} 
        />
      )}

      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AutoAwesomeIcon color="secondary" />
        שף AI אישי בהזמנה
      </Typography>
      
      <TextField
        fullWidth
        label="מה נבשל היום? (למשל: פסטה לילדים, משהו עם חצילים...)"
        variant="outlined"
        value={aiCriteria}
        onChange={(e) => setAiCriteria(e.target.value)}
        sx={{ mb: 2, bgcolor: 'white' }}
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
        {isGeneratingAiRecipe ? loadingMessages[messageIndex] : 'בקש מהשף מתכון'}
      </Button>

      {aiError && (
        <Typography color="error" variant="body2" sx={{ mt: 1.5, textAlign: 'center', bgcolor: '#ffebee', p: 1, borderRadius: 1 }}>
          {aiError}
        </Typography>
      )}

      <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary', textAlign: 'center', fontStyle: 'italic' }}>
         בכדי לשמור על מקסימום פרטיות המודל רץ מקוממית על המחשב שלך. זה ייקח כמה רגעים
      </Typography>
    </Box>
  );
};

export default AiRecipeRequestSection;