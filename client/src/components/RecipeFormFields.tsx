// client/src/components/RecipeFormFields.tsx
import React from 'react';
import type { SelectChangeEvent } from '@mui/material';
import type { IFullRecipeData } from '../types/Recipe';
import BasicInfoFields from './recipeForm/BasicInfoFields';
import TimeFields from './recipeForm/TimeFields';
import CategoryFields from './recipeForm/CategoryFields';

interface RecipeFormFieldsProps {
  formData: IFullRecipeData;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string | string[]>
  ) => void;
  submitError: string | null;
}

const RecipeFormFields: React.FC<RecipeFormFieldsProps> = ({
  formData,
  handleChange,
  submitError,
}) => {
  return (
    <>
      <BasicInfoFields
        formData={formData}
        handleChange={handleChange as (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void}
        submitError={submitError}
      />
      <TimeFields
        formData={formData}
        handleChange={handleChange as (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void}
      />
      <CategoryFields
        formData={formData}
        handleChange={handleChange as (event: SelectChangeEvent<string | string[]>) => void}
      />
    </>
  );
};

export default RecipeFormFields;