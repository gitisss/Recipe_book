// client/src/components/recipeView/RecipeDescription.tsx
import React from 'react';
import { Paper, Typography } from '@mui/material';

interface RecipeDescriptionProps {
  description?: string;
}

const RecipeDescription: React.FC<RecipeDescriptionProps> = ({ description }) => {
  return (
    <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        תיאור
      </Typography>
      <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
        {description || 'אין תיאור זמין.'}
      </Typography>
    </Paper>
  );
};

export default RecipeDescription;

