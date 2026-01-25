// client/src/components/IngredientsSection.tsx
import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type { IIngredient } from '../types/Recipe';

interface IngredientsSectionProps {
  ingredients: IIngredient[];
  handleIngredientChange: (index: number, field: keyof IIngredient, value: string) => void;
  addIngredientField: () => void;
  removeIngredientField: (index: number) => void;
  submitError: string | null;
}

const IngredientsSection: React.FC<IngredientsSectionProps> = ({
  ingredients,
  handleIngredientChange,
  addIngredientField,
  removeIngredientField,
  submitError,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        {t('recipe.ingredients')}
      </Typography>
      {ingredients.map((ingredient, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
          <TextField
            id={`ingredient-name-${index}`}
            label={t('recipe.ingredientName')}
            value={ingredient.name}
            onChange={(e) =>
              handleIngredientChange(index, 'name', e.target.value)
            }
            sx={{ flex: 3 }}
            required
            error={!!submitError && ingredients.every(ing => !ing.name.trim()) && index === 0}
            helperText={!!submitError && ingredients.every(ing => !ing.name.trim()) && index === 0 ? t('recipe.atLeastOneIngredient') : ''}
          />
          <TextField
            id={`ingredient-quantity-${index}`}
            label={t('recipe.quantity')}
            value={ingredient.quantity}
            onChange={(e) =>
              handleIngredientChange(index, 'quantity', e.target.value)
            }
            sx={{ flex: 1.5 }}
          />
          <TextField
            id={`ingredient-unit-${index}`}
            label={t('recipe.unit')}
            value={ingredient.unit}
            onChange={(e) =>
              handleIngredientChange(index, 'unit', e.target.value)
            }
            sx={{ flex: 1.5 }}
          />
          <IconButton
            onClick={() => removeIngredientField(index)}
            color="error"
            disabled={ingredients.length === 1 && index === 0}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
      <Button startIcon={<AddIcon />} onClick={addIngredientField} sx={{ mt: 1 }}>
        {t('recipe.addIngredient')}
      </Button>
    </>
  );
};

export default IngredientsSection;