// client/src/components/recipeView/RecipeInstructionsList.tsx
import React from 'react';
import { Paper, Typography } from '@mui/material';

interface RecipeInstructionsListProps {
  instructions: string[];
}

const RecipeInstructionsList: React.FC<RecipeInstructionsListProps> = ({ instructions }) => {
  return (
    <Paper elevation={0} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        הוראות הכנה
      </Typography>
      {instructions && instructions.length > 0 ? (
        <ol>
          {instructions.map((instruction: string, index: number) => (
            <li key={index}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {instruction}
              </Typography>
            </li>
          ))}
        </ol>
      ) : (
        <Typography variant="body1">
          אין הוראות הכנה זמינות.
        </Typography>
      )}
    </Paper>
  );
};

export default RecipeInstructionsList;

