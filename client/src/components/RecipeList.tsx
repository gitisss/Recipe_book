// client/src/components/RecipeList.tsx
import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  Button
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RecipeCard from './RecipeCard'; // ייבוא קומפוננטת RecipeCard

import type { IRecipe } from '../types/Recipe'; // ייבוא סוג IRecipe


// הגדרת הממשק ל-props של קומפוננטת RecipeList
interface RecipeListProps {
  recipes: IRecipe[]; // השתמש ב-IRecipe
  isLoading: boolean;
  onOpenAddRecipeModal: () => void;
  onViewRecipe: (id: string) => void;
  onEditRecipe: (id: string) => void;
  onDeleteRecipe: (id: string) => void;
}

const RecipeList: React.FC<RecipeListProps> = ({
  recipes,
  isLoading,
  onOpenAddRecipeModal,
  onViewRecipe,
  onEditRecipe,
  onDeleteRecipe
}) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>טוען מתכונים...</Typography>
      </Box>
    );
  }

  if (recipes.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, textAlign: 'center', backgroundColor: 'grey.100' }}>
        <Typography variant="body1" color="text.secondary">
          עדיין לא הוספת מתכונים.
          <Button variant="text" startIcon={<AddCircleOutlineIcon />} sx={{ml:1}} onClick={onOpenAddRecipeModal}>
            הוסף את המתכון הראשון שלך!
          </Button>
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center', pb: 2 }}>
      {recipes.map(recipe => (
        <RecipeCard
          key={recipe._id}
          id={recipe._id}
          title={recipe.title} // <-- שונה מ-recipe.name ל-recipe.title
          description={recipe.description || ''}
          imageUrl={recipe.imageUrl}
          onView={onViewRecipe}
          onEdit={onEditRecipe}
          onDelete={onDeleteRecipe}
        />
      ))}
    </Box>
  );
};

export default RecipeList;