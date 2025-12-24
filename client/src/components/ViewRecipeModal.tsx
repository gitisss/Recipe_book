// client/src/components/ViewRecipeModal.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider
} from '@mui/material';
import type { IRecipe } from '../types/Recipe';
import RecipeImage from './recipeView/RecipeImage';
import RecipeDescription from './recipeView/RecipeDescription';
import RecipeIngredientsList from './recipeView/RecipeIngredientsList';
import RecipeInstructionsList from './recipeView/RecipeInstructionsList';

interface ViewRecipeModalProps {
  open: boolean;
  onClose: () => void;
  recipe: IRecipe | null;
}

const ViewRecipeModal: React.FC<ViewRecipeModalProps> = ({ open, onClose, recipe }) => {
  
  if (!recipe) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        פרטי מתכון: {recipe.title}
      </DialogTitle>
      <DialogContent dividers>
        <RecipeImage imageUrl={recipe.imageUrl} title={recipe.title} />
        <RecipeDescription description={recipe.description} />
        <Divider sx={{ my: 3 }} />
        <RecipeIngredientsList ingredients={recipe.ingredients} />
        <Divider sx={{ my: 3 }} />
        <RecipeInstructionsList instructions={recipe.instructions} />
      </DialogContent>
      <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
        <Button onClick={onClose} color="primary" variant="contained">
          סגור
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewRecipeModal;