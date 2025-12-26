// client/src/hooks/useRecipeForm.ts
import { useState, useEffect, useCallback } from 'react';
import type { IFullRecipeData, IRecipe, IIngredient } from '../types/Recipe';
import type { SelectChangeEvent } from '@mui/material';

const getInitialEmptyFormData = (): IFullRecipeData => ({
  title: '',
  description: '',
  ingredients: [{ name: '', quantity: '', unit: '' }],
  instructions: [''],
  prepTime: '',
  cookTime: '',
  servings: '',
  category: '',
  cuisine: '',
  dietaryRestrictions: [],
});

export const useRecipeForm = (initialRecipeData: IRecipe | null | undefined, open: boolean) => {
  const [formData, setFormData] = useState<IFullRecipeData>(() => {
    if (initialRecipeData) {
      return {
        title: initialRecipeData.title,
        description: initialRecipeData.description || '',
        ingredients: initialRecipeData.ingredients,
        instructions: initialRecipeData.instructions,
        imageUrl: initialRecipeData.imageUrl || '',
        prepTime: initialRecipeData.prepTime || '',
        cookTime: initialRecipeData.cookTime || '',
        servings: initialRecipeData.servings || '',
        category: initialRecipeData.category || '',
        cuisine: initialRecipeData.cuisine || '',
        dietaryRestrictions: initialRecipeData.dietaryRestrictions || [],
      };
    }
    return getInitialEmptyFormData();
  });

  useEffect(() => {
    if (open) {
      if (initialRecipeData) {
        setFormData({
          title: initialRecipeData.title,
          description: initialRecipeData.description || '',
          ingredients: initialRecipeData.ingredients,
          instructions: initialRecipeData.instructions,
          imageUrl: initialRecipeData.imageUrl || '',
          prepTime: initialRecipeData.prepTime || '',
          cookTime: initialRecipeData.cookTime || '',
          servings: initialRecipeData.servings || '',
          category: initialRecipeData.category || '',
          cuisine: initialRecipeData.cuisine || '',
          dietaryRestrictions: initialRecipeData.dietaryRestrictions || [],
        });
      } else {
        setFormData(getInitialEmptyFormData());
      }
    }
    return () => {
      if (!open) {
        setFormData(getInitialEmptyFormData());
      }
    };
  }, [open, initialRecipeData]);

  const handleChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string | string[]>
  ) => {
    const { name, value } = event.target;
    if (name === 'dietaryRestrictions') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: typeof value === 'string' ? value.split(',') : value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name as keyof IFullRecipeData]: value,
      }));
    }
  }, []);

  const handleIngredientChange = useCallback((
    index: number,
    field: keyof IIngredient,
    value: string
  ) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setFormData({ ...formData, ingredients: newIngredients });
  }, [formData]);

  const addIngredientField = useCallback(() => {
    setFormData((prevData) => ({
      ...prevData,
      ingredients: [...prevData.ingredients, { name: '', quantity: '', unit: '' }],
    }));
  }, []);

  const removeIngredientField = useCallback((index: number) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: newIngredients });
  }, [formData]);

  const handleInstructionChange = useCallback((index: number, value: string) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    setFormData({ ...formData, instructions: newInstructions });
  }, [formData]);

  const addInstructionField = useCallback(() => {
    setFormData((prevData) => ({
      ...prevData,
      instructions: [...prevData.instructions, ''],
    }));
  }, []);

  const removeInstructionField = useCallback((index: number) => {
    const newInstructions = formData.instructions.filter((_, i) => i !== index);
    setFormData({ ...formData, instructions: newInstructions });
  }, [formData]);

  return {
    formData,
    setFormData,
    handleChange,
    handleIngredientChange,
    addIngredientField,
    removeIngredientField,
    handleInstructionChange,
    addInstructionField,
    removeInstructionField,
  };
};

