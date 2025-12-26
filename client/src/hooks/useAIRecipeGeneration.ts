// client/src/hooks/useAIRecipeGeneration.ts
import { useState, useCallback } from 'react';
import apiClient from '../apiClient';
import type { IFullRecipeData } from '../types/Recipe';

export const useAIRecipeGeneration = (setFormData: (data: IFullRecipeData) => void) => {
  const [aiCriteria, setAiCriteria] = useState<string>('');
  const [isGeneratingAiRecipe, setIsGeneratingAiRecipe] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleRequestRecipeFromAI = useCallback(async () => {
    if (!aiCriteria.trim()) {
      setAiError('אנא הזן קריטריונים לבקשת מתכון מה-AI (לדוגמה: מרכיבים, סוג ארוחה).');
      return;
    }

    setIsGeneratingAiRecipe(true);
    setAiError(null);
    try {
      const response = await apiClient.post('/ai/suggest-recipe', {
        ingredients: aiCriteria,
      });

      const aiSuggestedRecipe = response.data;
      console.log('AI Suggested Recipe:', aiSuggestedRecipe);

      setFormData({
        title: aiSuggestedRecipe.title || 'מתכון מה-AI ללא כותרת',
        description: aiSuggestedRecipe.description || '',
        ingredients: aiSuggestedRecipe.ingredients.map((ing: any) => ({
          name: ing.name || '',
          quantity: ing.quantity ? String(ing.quantity) : '',
          unit: ing.unit || '',
        })) || [{ name: '', quantity: '', unit: '' }],
        instructions: aiSuggestedRecipe.instructions || [''],
        imageUrl: aiSuggestedRecipe.imageUrl || '',
        prepTime: aiSuggestedRecipe.prepTime || '',
        cookTime: aiSuggestedRecipe.cookTime || '',
        servings: aiSuggestedRecipe.servings || '',
        category: aiSuggestedRecipe.category || '',
        cuisine: aiSuggestedRecipe.cuisine || '',
        dietaryRestrictions: aiSuggestedRecipe.dietaryRestrictions || [],
      });
      setAiCriteria('');
      alert('מתכון הוצע על ידי ה-AI בהצלחה! אנא בדוק וערוך לפני השמירה.');
    } catch (err: any) {
      console.error('Error requesting recipe from AI:', err);
      setAiError(err.response?.data?.message || 'אירעה שגיאה בבקשת מתכון מה-AI.');
    } finally {
      setIsGeneratingAiRecipe(false);
    }
  }, [aiCriteria, setFormData]);

  const resetAIState = useCallback(() => {
    setAiCriteria('');
    setAiError(null);
  }, []);

  return {
    aiCriteria,
    setAiCriteria,
    isGeneratingAiRecipe,
    aiError,
    handleRequestRecipeFromAI,
    resetAIState,
  };
};

