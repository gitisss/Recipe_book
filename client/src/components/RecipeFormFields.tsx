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
  activeFieldId: string | null;
}

const RecipeFormFields: React.FC<RecipeFormFieldsProps> = ({
  formData,
  handleChange,
  submitError,
  activeFieldId,
}) => {
  return (
    <>
      <BasicInfoFields
        formData={formData}
        handleChange={handleChange as (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void}
        submitError={submitError}
        activeFieldId={activeFieldId}
      />
      <TimeFields
        formData={formData}
        handleChange={handleChange as (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void}
        activeFieldId={activeFieldId}
      />
      <CategoryFields
        formData={formData}
        handleChange={handleChange as (event: SelectChangeEvent<string | string[]>) => void}
        activeFieldId={activeFieldId}
      />
    </>
  );
};

export default RecipeFormFields;