// client/src/components/recipeForm/TimeFields.tsx
import React from 'react';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { IFullRecipeData } from '../../types/Recipe';

interface TimeFieldsProps {
  formData: IFullRecipeData;
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const TimeFields: React.FC<TimeFieldsProps> = ({ formData, handleChange }) => {
  const { t } = useTranslation();
  return (
    <>
      <TextField
        fullWidth
        id="recipe-prepTime"
        label={t('recipe.prepTime')}
        name="prepTime"
        value={formData.prepTime}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        id="recipe-cookTime"
        label={t('recipe.cookTime')}
        name="cookTime"
        value={formData.cookTime}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        id="recipe-servings"
        label={t('recipe.servings')}
        name="servings"
        value={formData.servings}
        onChange={handleChange}
        margin="normal"
      />
    </>
  );
};

export default TimeFields;

