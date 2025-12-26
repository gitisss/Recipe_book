// client/src/hooks/useRecipes.ts
import { useState, useCallback } from 'react';
import type { IRecipe } from '../types/Recipe';
import apiClient from '../apiClient';

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = useCallback(async (category?: string, query?: string) => {
    setIsLoadingRecipes(true);
    setError(null);
    try {
      let url = '/recipes';
      const params = new URLSearchParams();
      if (category) {
        params.append('category', category);
      }
      if (query) {
        params.append('search', query);
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      const response = await apiClient.get(url);
      setRecipes(response.data);
    } catch (err: any) {
      console.error('Error fetching recipes:', err);
      setError(err.response?.data?.message || 'אירעה שגיאה בטעינת המתכונים.');
    } finally {
      setIsLoadingRecipes(false);
    }
  }, []);

  const deleteRecipe = useCallback(async (id: string) => {
    try {
      await apiClient.delete(`/recipes/${id}`);
      return true;
    } catch (err: any) {
      console.error('Error deleting recipe:', err);
      throw new Error(err.response?.data?.message || 'אירעה שגיאה במחיקת המתכון.');
    }
  }, []);

  const getRecipeById = useCallback(async (id: string) => {
    try {
      const response = await apiClient.get(`/recipes/${id}`);
      return response.data;
    } catch (err: any) {
      console.error('Error fetching recipe:', err);
      throw new Error(err.response?.data?.message || 'אירעה שגיאה בטעינת המתכון.');
    }
  }, []);

  return {
    recipes,
    isLoadingRecipes,
    error,
    fetchRecipes,
    deleteRecipe,
    getRecipeById,
    setRecipes,
  };
};

