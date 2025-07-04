// client/src/components/AddRecipeModal.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Paper,
  Divider
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DeleteIcon from '@mui/icons-material/Delete';

import type { IFullRecipeData, IIngredient} from '../types/Recipe';


interface AddRecipeModalProps {
  open: boolean;
  onClose: () => void;
  onAddRecipe: (recipeData: IFullRecipeData) => void; // השתמש ב-IFullRecipeData
}

const AddRecipeModal: React.FC<AddRecipeModalProps> = ({ open, onClose, onAddRecipe }) => {
  // ... שאר הקוד של הקומפוננטה (לוגיקה ו-JSX) נשאר זהה
  const [recipeName, setRecipeName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [instructions, setInstructions] = useState<string>('');
  const [ingredients, setIngredients] = useState<IIngredient[]>([{ name: '', quantity: 0, unit: '' }]); // השתמש ב-IIngredient
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleIngredientChange = (index: number, field: keyof IIngredient, value: string | number) => { // השתמש ב-IIngredient
    const newIngredients = [...ingredients];
    if (field === 'quantity') {
      newIngredients[index][field] = Number(value);
    } else {
      newIngredients[index][field] = value as string;
    }
    setIngredients(newIngredients);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: 0, unit: '' }]);
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleCreateRecipe = () => {
    // Basic validation
    if (!recipeName.trim() || !instructions.trim() || ingredients.some(ing => !ing.name.trim() || ing.quantity <= 0 || !ing.unit.trim())) {
      alert('אנא מלא את כל שדות החובה של המתכון והרכיבים.');
      return;
    }

    const newRecipe: IFullRecipeData = { // השתמש ב-IFullRecipeData
      name: recipeName,
      description: description,
      instructions: instructions,
      ingredients: ingredients.filter(ing => ing.name.trim() !== ''),
      imageUrl: imageUrl,
    };
    onAddRecipe(newRecipe);
    handleResetForm();
  };

  const handleResetForm = () => {
    setRecipeName('');
    setDescription('');
    setInstructions('');
    setIngredients([{ name: '', quantity: 0, unit: '' }]);
    setImageUrl('');
    onClose();
  };

  const isFormValid = () => {
    return recipeName.trim() !== '' && instructions.trim() !== '' &&
           ingredients.every(ing => ing.name.trim() !== '' && ing.quantity > 0 && ing.unit.trim() !== '');
  };

  return (
    <Dialog open={open} onClose={handleResetForm} fullWidth maxWidth="md">
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        הוסף מתכון חדש
        <Typography variant="body2" color="text.secondary">
          הזן את פרטי המתכון ידנית או השתמש באחת מהאפשרויות המתקדמות
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 3,
            p: 2,
            backgroundColor: 'action.hover',
            borderRadius: 2,
            justifyContent: 'center'
        }}>
          <Tooltip title="בקש רעיונות למתכון מבוססי AI על פי קלט שתספק">
            <Button
              variant="contained"
              color="primary"
              startIcon={<PsychologyIcon />}
              disabled
              fullWidth
              sx={{ py: 1.5 }}
              onClick={() => alert('פיצ\'ר AI להצעת מתכונים עדיין לא זמין')}
            >
              בקש מתכון מה-AI שלנו
            </Button>
          </Tooltip>
          <Tooltip title="העלה תמונה של מתכון מודפס או כתוב ידנית לסריקה אוטומטית">
            <Button
              variant="contained"
              color="primary"
              startIcon={<CameraAltIcon />}
              disabled
              fullWidth
              sx={{ py: 1.5 }}
              onClick={() => alert('פיצ\'ר סריקת צילום מתכון עדיין לא זמין')}
            >
              העלה צילום מתכון לסריקה
            </Button>
          </Tooltip>
        </Box>

        <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
                או הזן ידנית
            </Typography>
        </Divider>

        <Paper elevation={0} sx={{ p: 2 }}>
          <TextField
            margin="normal"
            label="שם המתכון *"
            type="text"
            fullWidth
            variant="outlined"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            label="תיאור קצר"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            label="הוראות הכנה *"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
            sx={{ mb: 3 }}
          />

          <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
            רכיבים *
          </Typography>
          {ingredients.map((ingredient, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
              <TextField
                label="שם רכיב"
                variant="outlined"
                size="small"
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                sx={{ flex: 3 }}
                required
              />
              <TextField
                label="כמות"
                variant="outlined"
                size="small"
                type="number"
                value={ingredient.quantity === 0 ? '' : ingredient.quantity}
                onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                sx={{ flex: 1 }}
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                label="יחידת מידה"
                variant="outlined"
                size="small"
                value={ingredient.unit}
                onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                sx={{ flex: 1.5 }}
                required
              />
              {ingredients.length > 1 && (
                <IconButton onClick={() => handleRemoveIngredient(index)} color="error" size="small">
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          ))}
          <Button
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleAddIngredient}
            variant="outlined"
            sx={{ mt: 1, mb: 3 }}
          >
            הוסף רכיב נוסף
          </Button>

          <TextField
            margin="normal"
            label="כתובת URL לתמונה"
            type="url"
            fullWidth
            variant="outlined"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            sx={{ mb: 2 }}
          />
        </Paper>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleResetForm} color="primary">
          ביטול
        </Button>
        <Button
          onClick={handleCreateRecipe}
          color="primary"
          variant="contained"
          disabled={!isFormValid()}
        >
          צור מתכון
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRecipeModal;