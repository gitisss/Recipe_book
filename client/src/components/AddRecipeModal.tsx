// client/src/components/AddRecipeModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Modal, Box, Typography, TextField, Button, IconButton,
  List, ListItem, ListItemText, ListItemSecondaryAction, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IFullRecipeData, IRecipe } from '../types/Recipe'; // ייבוא IRecipe

interface AddRecipeModalProps {
  open: boolean;
  onClose: () => void;
  onAddRecipe?: (recipeData: IFullRecipeData) => void;
  onEditRecipe?: (id: string, recipeData: IFullRecipeData) => void;
  initialRecipeData?: IRecipe | null; // שינוי ל-IRecipe
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', md: 800 },
  maxHeight: '90vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const categories = [
  'עיקרית',
  'קינוח',
  'ארוחת בוקר',
  'מרק',
  'סלט',
  'מאפה',
  'ללא קטגוריה', // קטגוריה חדשה
];

const AddRecipeModal: React.FC<AddRecipeModalProps> = ({ open, onClose, onAddRecipe, onEditRecipe, initialRecipeData }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [instructions, setInstructions] = useState<string[]>([]);
  const [newInstruction, setNewInstruction] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [category, setCategory] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');

  useEffect(() => {
    if (initialRecipeData) {
      setTitle(initialRecipeData.title || '');
      setDescription(initialRecipeData.description || '');
      setIngredients(initialRecipeData.ingredients || []);
      setInstructions(initialRecipeData.instructions || []);
      setImageUrl(initialRecipeData.imageUrl || '');
      setPrepTime(initialRecipeData.prepTime || '');
      setCookTime(initialRecipeData.cookTime || '');
      setServings(initialRecipeData.servings || '');
      setCategory(initialRecipeData.category || 'ללא קטגוריה'); // הגדר "ללא קטגוריה" כברירת מחדל אם ריק
      setCuisine(initialRecipeData.cuisine || '');
      setDietaryRestrictions(initialRecipeData.dietaryRestrictions || '');
    } else {
      // איפוס שדות כאשר המודאל נפתח להוספה חדשה
      setTitle('');
      setDescription('');
      setIngredients([]);
      setNewIngredient('');
      setInstructions([]);
      setNewInstruction('');
      setImageUrl('');
      setPrepTime('');
      setCookTime('');
      setServings('');
      setCategory('ללא קטגוריה'); // ברירת מחדל "ללא קטגוריה" למתכון חדש
      setCuisine('');
      setDietaryRestrictions('');
    }
  }, [initialRecipeData, open]); // הוסף open כתלות כדי לאפס בעת פתיחה

  const handleAddIngredient = () => {
    if (newIngredient.trim() !== '') {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const handleDeleteIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleEditIngredient = (index: number, newValue: string) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = newValue;
    setIngredients(updatedIngredients);
  };

  const handleAddInstruction = () => {
    if (newInstruction.trim() !== '') {
      setInstructions([...instructions, newInstruction.trim()]);
      setNewInstruction('');
    }
  };

  const handleDeleteInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleEditInstruction = (index: number, newValue: string) => {
    const updatedInstructions = [...instructions];
    updatedInstructions[index] = newValue;
    setInstructions(updatedInstructions);
  };

  const handleSubmit = () => {
    const recipeData: IFullRecipeData = {
      title,
      description,
      ingredients,
      instructions,
      imageUrl,
      prepTime,
      cookTime,
      servings,
      category,
      cuisine,
      dietaryRestrictions,
    };

    if (initialRecipeData && onEditRecipe) {
      onEditRecipe(initialRecipeData._id, recipeData);
    } else if (onAddRecipe) {
      onAddRecipe(recipeData);
    }
  };

  const isEditMode = !!initialRecipeData;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby={isEditMode ? "edit-recipe-modal-title" : "add-recipe-modal-title"}
      aria-describedby={isEditMode ? "edit-recipe-modal-description" : "add-recipe-modal-description"}
    >
      <Box sx={style}>
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
        <Typography id={isEditMode ? "edit-recipe-modal-title" : "add-recipe-modal-title"} variant="h6" component="h2" sx={{ mb: 2 }}>
          {isEditMode ? 'ערוך מתכון' : 'הוסף מתכון חדש'}
        </Typography>
        <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="שם המתכון"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="תיאור קצר"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={2}
          />
          <TextField
            label="כתובת URL לתמונה"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            fullWidth
          />
          <TextField
            label="זמן הכנה (דקות)"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            fullWidth
          />
          <TextField
            label="זמן בישול/אפייה (דקות)"
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
            fullWidth
          />
          <TextField
            label="מספר מנות"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel id="category-select-label">קטגוריה</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={category}
              label="קטגוריה"
              onChange={(e) => setCategory(e.target.value as string)}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="מטבח (לדוגמה: איטלקי, אסייתי)"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            fullWidth
          />
          <TextField
            label="הגבלות תזונתיות (לדוגמה: טבעוני, ללא גלוטן)"
            value={dietaryRestrictions}
            onChange={(e) => setDietaryRestrictions(e.target.value)}
            fullWidth
          />

          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>רכיבים</Typography>
          <List dense>
            {ingredients.map((item, index) => (
              <ListItem key={index}>
                <ListItemText primary={item} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="edit" onClick={() => {
                    const newValue = prompt("ערוך רכיב:", item);
                    if (newValue !== null) handleEditIngredient(index, newValue);
                  }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteIngredient(index)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              label="הוסף רכיב חדש"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              fullWidth
            />
            <Button variant="contained" onClick={handleAddIngredient} startIcon={<AddIcon />}>
              הוסף
            </Button>
          </Box>

          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>הוראות הכנה</Typography>
          <List dense>
            {instructions.map((item, index) => (
              <ListItem key={index}>
                <ListItemText primary={`שלב ${index + 1}: ${item}`} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="edit" onClick={() => {
                    const newValue = prompt("ערוך הוראה:", item);
                    if (newValue !== null) handleEditInstruction(index, newValue);
                  }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteInstruction(index)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              label="הוסף שלב חדש"
              value={newInstruction}
              onChange={(e) => setNewInstruction(e.target.value)}
              fullWidth
            />
            <Button variant="contained" onClick={handleAddInstruction} startIcon={<AddIcon />}>
              הוסף
            </Button>
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ mt: 3 }}
          >
            {isEditMode ? 'שמור שינויים' : 'צור מתכון'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddRecipeModal;