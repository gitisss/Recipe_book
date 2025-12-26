// client/src/components/recipeForm/CategoryFields.tsx
import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { IFullRecipeData } from '../../types/Recipe';

interface CategoryFieldsProps {
  formData: IFullRecipeData;
  handleChange: (event: SelectChangeEvent<string | string[]>) => void;
}

const CategoryFields: React.FC<CategoryFieldsProps> = ({ formData, handleChange }) => {
  return (
    <>
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

export default CategoryFields;

