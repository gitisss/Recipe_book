// client/src/components/recipeForm/TimeFields.tsx
import React from 'react';
import { TextField } from '@mui/material';
import type { IFullRecipeData } from '../../types/Recipe';

interface TimeFieldsProps {
  formData: IFullRecipeData;
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const TimeFields: React.FC<TimeFieldsProps> = ({ formData, handleChange }) => {
  return (
    <>
      <TextField
        fullWidth
        label="זמן הכנה (לדוגמה: 30 דקות)"
        name="prepTime"
        value={formData.prepTime}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="זמן בישול (לדוגמה: שעה)"
        name="cookTime"
        value={formData.cookTime}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="מספר מנות"
        name="servings"
        value={formData.servings}
        onChange={handleChange}
        margin="normal"
      />
    </>
  );
};

export default TimeFields;

