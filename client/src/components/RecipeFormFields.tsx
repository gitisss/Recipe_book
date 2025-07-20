// client/src/components/RecipeFormFields.tsx
import React from 'react';
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material'; 
import type { IFullRecipeData } from '../types/Recipe';

// הגדרת הממשק עבור ה-props של הקומפוננטה החדשה
interface RecipeFormFieldsProps {
  formData: IFullRecipeData;
  // <--- תיקון כאן! עדכון חתימת הטיפוס של handleChange
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string | string[]>
  ) => void;
  submitError: string | null;
}

const RecipeFormFields: React.FC<RecipeFormFieldsProps> = ({
  formData,
  handleChange,
  submitError,
}) => {
  return (
    <>
      <TextField
        fullWidth
        label="כותרת המתכון"
        name="title"
        value={formData.title}
        onChange={handleChange}
        margin="normal"
        required
        error={!!submitError && formData.title.trim() === ''}
        helperText={!!submitError && formData.title.trim() === '' ? 'כותרת המתכון הינה שדה חובה.' : ''}
      />
      <TextField
        fullWidth
        label="תיאור"
        name="description"
        value={formData.description}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={2}
      />

      <TextField
        fullWidth
        label="זמן הכנה (לדוגמה: 30 דקות)"
        name="prepTime"
        value={formData.prepTime}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="זמן בישול (לדוגמה: שעה)"
        name="cookTime"
        value={formData.cookTime}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="מספר מנות"
        name="servings"
        value={formData.servings}
        onChange={handleChange}
        margin="normal"
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>קטגוריה</InputLabel>
        <Select
          name="category"
          value={formData.category}
          onChange={handleChange}
          label="קטגוריה"
        >
          <MenuItem value="">_בחר קטגוריה_</MenuItem>
          <MenuItem value="עיקרית">עיקרית</MenuItem>
          <MenuItem value="קינוח">קינוח</MenuItem>
          <MenuItem value="ארוחת בוקר">ארוחת בוקר</MenuItem>
          <MenuItem value="מרק">מרק</MenuItem>
          <MenuItem value="סלט">סלט</MenuItem>
          <MenuItem value="מאפה">מאפה</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>מטבח</InputLabel>
        <Select
          name="cuisine"
          value={formData.cuisine}
          onChange={handleChange}
          label="מטבח"
        >
          <MenuItem value="">_בחר מטבח_</MenuItem>
          <MenuItem value="ישראלי">ישראלי</MenuItem>
          <MenuItem value="איטלקי">איטלקי</MenuItem>
          <MenuItem value="אסייתי">אסייתי</MenuItem>
          <MenuItem value="מזרח תיכוני">מזרח תיכוני</MenuItem>
          <MenuItem value="אמריקאי">אמריקאי</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>הגבלות תזונתיות</InputLabel>
        <Select
          name="dietaryRestrictions"
          multiple
          value={formData.dietaryRestrictions}
          onChange={handleChange}
          label="הגבלות תזונתיות"
          renderValue={(selected) => (selected as string[]).join(', ')}
        >
          <MenuItem value="טבעוני">טבעוני</MenuItem>
          <MenuItem value="צמחוני">צמחוני</MenuItem>
          <MenuItem value="ללא גלוטן">ללא גלוטן</MenuItem>
          <MenuItem value="ללא לקטוז">ללא לקטוז</MenuItem>
          <MenuItem value="כשר">כשר</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

export default RecipeFormFields;