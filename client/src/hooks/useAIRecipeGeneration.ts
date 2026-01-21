// client/src/hooks/useAIRecipeGeneration.ts
import { useState, useCallback } from 'react';
import type { IFullRecipeData } from '../types/Recipe';

export const useAIRecipeGeneration = (setFormData: (data: IFullRecipeData) => void) => {
  const [aiCriteria, setAiCriteria] = useState<string>('');
  const [isGeneratingAiRecipe, setIsGeneratingAiRecipe] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);

  const handleRequestRecipeFromAI = useCallback(async () => {
    if (!aiCriteria.trim()) {
      setAiError('אנא הזן קריטריונים לבקשת מתכון מה-AI (לדוגמה: מרכיבים, סוג ארוחה).');
      return;
    }

    setIsGeneratingAiRecipe(true);
    setAiError(null);
    setActiveFieldId(null);

    // Dynamic import for the parser to avoid circular dependency issues if any
    const { parsePartialJson } = await import('../utils/partialJsonParser');

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3000/api/ai/suggest-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          ingredients: aiCriteria,
        }),
      });

      if (!response.body) {
        throw new Error('ReadableStream not supported in this browser.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponseText = '';

      // Keep track of previous state to detect changes
      let prevPartial: any = {};

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        fullResponseText += chunk;

        // Try to parse partial JSON and update UI
        const partialData = parsePartialJson(fullResponseText);
        if (partialData) {
          // Detect active field
          if (partialData.title !== prevPartial.title) setActiveFieldId('recipe-title');
          else if (partialData.description !== prevPartial.description) setActiveFieldId('recipe-description');
          else if (Array.isArray(partialData.ingredients)) {
            const currentIngs = partialData.ingredients;
            const prevIngs = Array.isArray(prevPartial.ingredients) ? prevPartial.ingredients : [];
            if (currentIngs.length > prevIngs.length) {
              setActiveFieldId(`ingredient-name-${currentIngs.length - 1}`);
            } else if (currentIngs.length > 0) {
              const lastIdx = currentIngs.length - 1;
              const currLast = currentIngs[lastIdx];
              const prevLast = prevIngs[lastIdx] || {};
              if (currLast.name !== prevLast.name) setActiveFieldId(`ingredient-name-${lastIdx}`);
              else if (currLast.quantity !== prevLast.quantity) setActiveFieldId(`ingredient-quantity-${lastIdx}`);
              else if (currLast.unit !== prevLast.unit) setActiveFieldId(`ingredient-unit-${lastIdx}`);
            }
          }

          if (Array.isArray(partialData.instructions)) {
            const currentInst = partialData.instructions;
            const prevInst = Array.isArray(prevPartial.instructions) ? prevPartial.instructions : [];
            if (currentInst.length > prevInst.length) {
              setActiveFieldId(`instruction-${currentInst.length - 1}`);
            } else if (currentInst.length > 0) {
              const lastIdx = currentInst.length - 1;
              if (currentInst[lastIdx] !== prevInst[lastIdx]) {
                setActiveFieldId(`instruction-${lastIdx}`);
              }
            }
          }

          if (partialData.prepTime !== prevPartial.prepTime) setActiveFieldId('recipe-prepTime');
          else if (partialData.cookTime !== prevPartial.cookTime) setActiveFieldId('recipe-cookTime');
          else if (partialData.servings !== prevPartial.servings) setActiveFieldId('recipe-servings');

          prevPartial = partialData;

          setFormData({
            title: partialData.title || (fullResponseText.length > 10 ? 'מתכון בהכנה...' : ''),
            description: partialData.description || '',
            ingredients: Array.isArray(partialData.ingredients)
              ? partialData.ingredients.map((ing: any) => ({
                name: ing.name || '',
                quantity: ing.quantity ? String(ing.quantity) : '',
                unit: ing.unit || '',
              }))
              : [{ name: '', quantity: '', unit: '' }],
            instructions: Array.isArray(partialData.instructions) ? partialData.instructions : [''],
            imageUrl: partialData.imageUrl || '',
            prepTime: partialData.prepTime || '',
            cookTime: partialData.cookTime || '',
            servings: partialData.servings || '',
            category: partialData.category || '',
            cuisine: partialData.cuisine || '',
            dietaryRestrictions: Array.isArray(partialData.dietaryRestrictions) ? partialData.dietaryRestrictions : [],
          });
        }
      }

      // Final consistency check
      try {
        const finalData = JSON.parse(fullResponseText);
        setFormData({
          title: finalData.title || 'מתכון מה-AI',
          description: finalData.description || '',
          ingredients: Array.isArray(finalData.ingredients)
            ? finalData.ingredients.map((ing: any) => ({
              name: ing.name || '',
              quantity: ing.quantity ? String(ing.quantity) : '',
              unit: ing.unit || '',
            }))
            : [{ name: '', quantity: '', unit: '' }],
          instructions: Array.isArray(finalData.instructions) ? finalData.instructions : [''],
          imageUrl: finalData.imageUrl || '',
          prepTime: finalData.prepTime || '',
          cookTime: finalData.cookTime || '',
          servings: finalData.servings || '',
          category: finalData.category || '',
          cuisine: finalData.cuisine || '',
          dietaryRestrictions: Array.isArray(finalData.dietaryRestrictions) ? finalData.dietaryRestrictions : [],
        });
        alert('מתכון הוצע על ידי ה-AI בהצלחה! אנא בדוק וערוך לפני השמירה.');
      } catch (e) {
        console.error("Final JSON parse failed, but stream finished.", e);
        // If partial updates worked, we might be fine, or show an error only if it's garbage.
        // We rely on the last successful partial update.
      }

      setAiCriteria('');
      setActiveFieldId(null);

    } catch (err: any) {
      console.error('Error requesting recipe from AI:', err);
      setAiError(err.response?.data?.message || err.message || 'אירעה שגיאה בבקשת מתכון מה-AI.');
    } finally {
      setIsGeneratingAiRecipe(false);
      setActiveFieldId(null);
    }
  }, [aiCriteria, setFormData]);

  const resetAIState = useCallback(() => {
    setAiCriteria('');
    setAiError(null);
    setActiveFieldId(null);
  }, []);

  return {
    aiCriteria,
    setAiCriteria,
    isGeneratingAiRecipe,
    aiError,
    handleRequestRecipeFromAI,
    resetAIState,
    activeFieldId
  };
};

