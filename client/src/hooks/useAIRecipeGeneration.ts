// client/src/hooks/useAIRecipeGeneration.ts
import { useState, useCallback } from 'react';
import type { IFullRecipeData } from '../types/Recipe';
import { API_BASE_URL } from '../apiClient';
import i18n from '../i18n';

export const useAIRecipeGeneration = (formData: IFullRecipeData, setFormData: (data: IFullRecipeData) => void) => {
  const [aiCriteria, setAiCriteria] = useState<string>('');
  const [isGeneratingAiRecipe, setIsGeneratingAiRecipe] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  
  const [isAiConfirmModalOpen, setIsAiConfirmModalOpen] = useState(false);
  const [prevFormData, setPrevFormData] = useState<IFullRecipeData | null>(null);

  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);

  const handleRequestRecipeFromAI = useCallback(async () => {
    if (!aiCriteria.trim()) {
      setAiError(i18n.t('ai.criteriaRequired'));
      return;
    }

    setIsGeneratingAiRecipe(true);
    setAiError(null);
    setActiveFieldId(null);
    setPrevFormData(formData); // Save current form state

    // Dynamic import for the parser to avoid circular dependency issues if any
    const { parsePartialJson } = await import('../utils/partialJsonParser');

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/ai/suggest-recipe`, {
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
        
        // Artificial typing effect: slice chunk into small pieces
        const charArray = Array.from(chunk);
        for (let i = 0; i < charArray.length; i += 3) { // Process 3 characters at a time for smooth typing
          fullResponseText += charArray.slice(i, i + 3).join('');

          // We don't want to parse on literally every character to save CPU,
          // but doing it on every character is fine if strings are small.
          // Let's parse on every character so the typing is visible.

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
            title: partialData.title || (fullResponseText.length > 10 ? i18n.t('ai.preparing') : ''),
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
          
          // Small delay to simulate typing speed
          await new Promise(r => setTimeout(r, 5));
        }
        } // close for loop
      } // close while loop

      // Final consistency check
      try {
        const finalData = JSON.parse(fullResponseText);
        setFormData({
          title: finalData.title || i18n.t('ai.aiRecipe'),
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
        setIsAiConfirmModalOpen(true);
      } catch (e) {
        console.error("Final JSON parse failed, but stream finished.", e);
        // Even if final parse fails, if we got here we show modal so user can review the partial data.
        setIsAiConfirmModalOpen(true);
      }

      setAiCriteria('');
      setActiveFieldId(null);

    } catch (err: any) {
      console.error('Error requesting recipe from AI:', err);
      setAiError(err.response?.data?.message || err.message || i18n.t('ai.aiError'));
    } finally {
      setIsGeneratingAiRecipe(false);
      setActiveFieldId(null);
    }
  }, [aiCriteria, setFormData, formData]);

  const handleAcceptAiRecipe = useCallback(() => {
    setIsAiConfirmModalOpen(false);
    setPrevFormData(null);
  }, []);

  const handleCancelAiRecipe = useCallback(() => {
    if (prevFormData) {
      setFormData(prevFormData);
    }
    setIsAiConfirmModalOpen(false);
    setPrevFormData(null);
  }, [prevFormData, setFormData]);

  const resetAIState = useCallback(() => {
    setAiCriteria('');
    setAiError(null);
    setActiveFieldId(null);
    setIsAiConfirmModalOpen(false);
  }, []);

  return {
    aiCriteria,
    setAiCriteria,
    isGeneratingAiRecipe,
    aiError,
    handleRequestRecipeFromAI,
    resetAIState,
    activeFieldId,
    isAiConfirmModalOpen,
    handleAcceptAiRecipe,
    handleCancelAiRecipe
  };
};

