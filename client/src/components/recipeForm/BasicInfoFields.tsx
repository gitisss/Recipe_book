// client/src/components/recipeForm/BasicInfoFields.tsx
import React from 'react';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { IFullRecipeData } from '../../types/Recipe';

interface BasicInfoFieldsProps {
  formData: IFullRecipeData;
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  submitError: string | null;
  activeFieldId: string | null;
}

const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({
  formData,
  handleChange,
  submitError,
  activeFieldId,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <TextField
        fullWidth
        id="recipe-title"
        label={t('recipe.recipeTitle')}
        name="title"
        value={formData.title}
        onChange={handleChange}
        margin="normal"
        required
        error={!!submitError && formData.title.trim() === ''}
        helperText={!!submitError && formData.title.trim() === '' ? t('recipe.titleRequired') : ''}
      />
      <TextField
        fullWidth
        id="recipe-description"
        label={t('recipe.description')}
        name="description"
        value={formData.description}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={2}
      />
    </>
  );
};

export default BasicInfoFields;

