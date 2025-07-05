// client/src/components/ViewRecipeModal.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Paper
} from '@mui/material';
import type { IRecipe, IIngredient } from '../types/Recipe';

interface ViewRecipeModalProps {
  open: boolean;
  onClose: () => void;
  recipe: IRecipe | null;
}

const ViewRecipeModal: React.FC<ViewRecipeModalProps> = ({ open, onClose, recipe }) => {
  if (!recipe) {
    return null; // או רנדר מצב טעינה/שגיאה
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        פרטי מתכון: {recipe.name}
      </DialogTitle>
      <DialogContent dividers>
        {recipe.imageUrl && (
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }}
            />
          </Box>
        )}

        <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            תיאור
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {recipe.description || 'אין תיאור זמין.'}
          </Typography>
        </Paper>

        <Divider sx={{ my: 3 }} />

        <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            רכיבים
          </Typography>
          {recipe.ingredients && recipe.ingredients.length > 0 ? (
            <ul>
              {recipe.ingredients.map((ingredient: IIngredient, index: number) => (
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

        <Divider sx={{ my: 3 }} />

        <Paper elevation={0} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            הוראות הכנה
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {recipe.instructions}
          </Typography>
        </Paper>
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