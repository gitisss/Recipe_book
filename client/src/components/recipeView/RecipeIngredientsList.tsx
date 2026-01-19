// client/src/components/recipeView/RecipeIngredientsList.tsx
import React from 'react';
import { Paper, Typography } from '@mui/material';
import type { IIngredient } from '../../types/Recipe';

interface RecipeIngredientsListProps {
  ingredients: IIngredient[];
}

const RecipeIngredientsList: React.FC<RecipeIngredientsListProps> = ({ ingredients }) => {
  return (
    <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        רכיבים
      </Typography>
      {ingredients && ingredients.length > 0 ? (
        <ul>
          {ingredients.map((ingredient: IIngredient, index: number) => (
            <li key={index}>
              <Typography variant="body1">
                {ingredient.name} - {ingredient.quantity} {ingredient.unit}
              </Typography>
            </li>
          ))}
        </ul>
      ) : (
        <Typography variant="body1">
          אין רכיבים זמינים.
        </Typography>
      )}
    </Paper>
  );
};

export default RecipeIngredientsList;

