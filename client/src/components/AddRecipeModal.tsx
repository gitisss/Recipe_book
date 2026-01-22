// client/src/components/AddRecipeModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { IFullRecipeData, IRecipe } from '../types/Recipe';
import AiRecipeRequestSection from './AiRecipeRequestSection';
import RecipeFormFields from './RecipeFormFields';
import IngredientsSection from './IngredientsSection';
import InstructionsSection from './InstructionsSection';
import { useRecipeForm } from '../hooks/useRecipeForm';
import { useAIRecipeGeneration } from '../hooks/useAIRecipeGeneration';

interface AddRecipeModalProps {
  open: boolean;
  onClose: () => void;
  onAddRecipe?: (recipeData: IFullRecipeData) => Promise<void>;
  onEditRecipe?: (id: string, recipeData: IFullRecipeData) => Promise<void>;
  initialRecipeData?: IRecipe | null;
}

const AddRecipeModal: React.FC<AddRecipeModalProps> = ({
  open,
  onClose,
  onAddRecipe,
  onEditRecipe,
  initialRecipeData,
}) => {
  const {
    formData,
    setFormData,
    handleChange,
    handleIngredientChange,
    addIngredientField,
    removeIngredientField,
    handleInstructionChange,
    addInstructionField,
    removeInstructionField,
  } = useRecipeForm(initialRecipeData, open);

  const {
    aiCriteria,
    setAiCriteria,
    isGeneratingAiRecipe,
    aiError,
    handleRequestRecipeFromAI,
    activeFieldId // Get active field ID
  } = useAIRecipeGeneration(setFormData);

  // Auto-scroll effect
  React.useEffect(() => {
    if (activeFieldId) {
      const element = document.getElementById(activeFieldId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
    }
  }, [activeFieldId]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);


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

    console.log('Submitting formData from AddRecipeModal:', formData);

    try {
      if (initialRecipeData) {
        if (onEditRecipe) {
          await onEditRecipe(initialRecipeData._id, formData);
        }
      } else {
        if (onAddRecipe) {
          console.log('Calling onAddRecipe with:', formData);
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