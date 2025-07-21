// client/src/components/AddRecipeModal.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { SelectChangeEvent } from '@mui/material';
import apiClient from '../apiClient';

import type { IFullRecipeData, IIngredient, IRecipe } from '../types/Recipe';

import AiRecipeRequestSection from './AiRecipeRequestSection';
import RecipeFormFields from './RecipeFormFields';
import IngredientsSection from './IngredientsSection';
import InstructionsSection from './InstructionsSection';


interface AddRecipeModalProps {
  open: boolean;
  onClose: () => void;
  onAddRecipe?: (recipeData: IFullRecipeData) => Promise<void>;
  onEditRecipe?: (id: string, recipeData: IFullRecipeData) => Promise<void>;
  initialRecipeData?: IRecipe | null;
}

// פונקציית עזר לאתחול נתוני טופס ריקים
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


const AddRecipeModal: React.FC<AddRecipeModalProps> = ({
  open,
  onClose,
  onAddRecipe,
  onEditRecipe,
  initialRecipeData,
}) => {
  // אתחול formData בהתבסס על initialRecipeData
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [aiCriteria, setAiCriteria] = useState<string>('');
  const [isGeneratingAiRecipe, setIsGeneratingAiRecipe] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // useEffect זה יטפל בטעינה של initialRecipeData במצב עריכה
  // ובאיפוס הטופס כאשר המודאל נפתח במצב הוספה חדש (initialRecipeData הוא null)
  useEffect(() => {
    if (open) { // רק כאשר המודאל פתוח
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
        // אם המודאל נפתח במצב חדש (initialRecipeData הוא null), נאפס אותו
        setFormData(getInitialEmptyFormData());
      }
      setAiCriteria(''); // נאפס גם את שדות ה-AI בכל פתיחה
      setAiError(null);
    }
    // פונקציה שתרוץ כשקומפוננטה תעשה unmount או כש-open יהפוך ל-false (מודאל נסגר)
    return () => {
      if (!open) { // כאשר המודאל נסגר
        setFormData(getInitialEmptyFormData()); // נאפס לריק עבור הפתיחה הבאה
        setAiCriteria('');
        setAiError(null);
      }
    };
  }, [open, initialRecipeData]);


  const handleChange = (
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
  };

  const handleIngredientChange = (
    index: number,
    field: keyof IIngredient,
    value: string
  ) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addIngredientField = () => {
    setFormData((prevData) => ({
      ...prevData,
      ingredients: [...prevData.ingredients, { name: '', quantity: '', unit: '' }],
    }));
  };

  const removeIngredientField = (index: number) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    setFormData({ ...formData, instructions: newInstructions });
  };

  const addInstructionField = () => {
    setFormData((prevData) => ({
      ...prevData,
      instructions: [...prevData.instructions, ''],
    }));
  };

  const removeInstructionField = (index: number) => {
    const newInstructions = formData.instructions.filter((_, i) => i !== index);
    setFormData({ ...formData, instructions: newInstructions });
  };

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
  }, [aiCriteria]);


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    if (!formData.title.trim()) {
      setSubmitError('כותרת המתכון הינה שדה חובה.');
      setIsSubmitting(false);
      return;
    }
    if (formData.ingredients.length === 0 || formData.ingredients.every(ing => !ing.name.trim())) {
      setSubmitError('יש להזין לפחות מרכיב אחד למתכון.');
      setIsSubmitting(false);
      return;
    }

    console.log('Submitting formData:', formData);

    try {
      if (initialRecipeData) {
        if (onEditRecipe) {
          await onEditRecipe(initialRecipeData._id, formData);
        }
      } else {
        if (onAddRecipe) {
          await onAddRecipe(formData);
        }
      }
      onClose();
    } catch (err: any) {
      console.error('Failed to submit recipe:', err);
      setSubmitError(err.response?.data?.message || 'אירעה שגיאה בשמירת המתכון.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', md: '70%', lg: '60%' },
          maxHeight: '90vh',
          overflowY: 'auto',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
          {initialRecipeData ? 'ערוך מתכון' : 'הוסף מתכון חדש'}
        </Typography>

        {!initialRecipeData && (
          <AiRecipeRequestSection
            aiCriteria={aiCriteria}
            setAiCriteria={setAiCriteria}
            handleRequestRecipeFromAI={handleRequestRecipeFromAI}
            isGeneratingAiRecipe={isGeneratingAiRecipe}
            aiError={aiError}
          />
        )}

        <form onSubmit={handleSubmit}>
          <RecipeFormFields
            formData={formData}
            handleChange={handleChange}
            submitError={submitError}
          />

          <IngredientsSection
            ingredients={formData.ingredients}
            handleIngredientChange={handleIngredientChange}
            addIngredientField={addIngredientField}
            removeIngredientField={removeIngredientField}
            submitError={submitError}
          />

          <InstructionsSection
            instructions={formData.instructions}
            handleInstructionChange={handleInstructionChange}
            addInstructionField={addInstructionField}
            removeInstructionField={removeInstructionField}
          />

          <TextField
            fullWidth
            label="כתובת URL לתמונה"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            margin="normal"
            sx={{ mb: 2 }}
          />

          {submitError && (
            <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
              {submitError}
            </Typography>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isSubmitting || isGeneratingAiRecipe}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : initialRecipeData ? 'שמור שינויים' : 'הוסף מתכון'}
            </Button>
            <Button variant="outlined" onClick={onClose} disabled={isSubmitting || isGeneratingAiRecipe}>
              בטל
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default AddRecipeModal;