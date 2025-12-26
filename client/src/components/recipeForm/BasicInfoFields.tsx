// client/src/components/recipeForm/BasicInfoFields.tsx
import React from 'react';
import { TextField } from '@mui/material';
import type { IFullRecipeData } from '../../types/Recipe';

interface BasicInfoFieldsProps {
  formData: IFullRecipeData;
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  submitError: string | null;
}

const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({
  formData,
  handleChange,
  submitError,
}) => {
  return (
    <>
      <TextField
        fullWidth
        label="כותרת המתכון"
        name="title"
        value={formData.title}
        onChange={handleChange}
        margin="normal"
        required
        error={!!submitError && formData.title.trim() === ''}
        helperText={!!submitError && formData.title.trim() === '' ? 'כותרת המתכון הינה שדה חובה.' : ''}
      />
      <TextField
        fullWidth
        label="תיאור"
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

