// client/src/components/recipeForm/CategoryFields.tsx
import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { SelectChangeEvent } from '@mui/material';
import type { IFullRecipeData } from '../../types/Recipe';

interface CategoryFieldsProps {
  formData: IFullRecipeData;
  handleChange: (event: SelectChangeEvent<string | string[]>) => void;
  activeFieldId: string | null;
}

const CategoryFields: React.FC<CategoryFieldsProps> = ({ formData, handleChange, activeFieldId }) => {
  const { t } = useTranslation();
  return (
    <>
      <FormControl fullWidth margin="normal">
        <InputLabel id="category-label">{t('recipe.category')}</InputLabel>
        <Select
          labelId="category-label"
          id="recipe-category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          label={t('recipe.category')}
        >
          <MenuItem value="">{t('recipe.selectCategory')}</MenuItem>
          <MenuItem value="עיקרית">{t('categories.mainCourse')}</MenuItem>
          <MenuItem value="קינוח">{t('categories.dessert')}</MenuItem>
          <MenuItem value="ארוחת בוקר">{t('categories.breakfast')}</MenuItem>
          <MenuItem value="מרק">{t('categories.soup')}</MenuItem>
          <MenuItem value="סלט">{t('categories.salad')}</MenuItem>
          <MenuItem value="מאפה">{t('categories.pastry')}</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="cuisine-label">{t('recipe.cuisine')}</InputLabel>
        <Select
          labelId="cuisine-label"
          id="recipe-cuisine"
          name="cuisine"
          value={formData.cuisine}
          onChange={handleChange}
          label={t('recipe.cuisine')}
        >
          <MenuItem value="">{t('recipe.selectCuisine')}</MenuItem>
          <MenuItem value="ישראלי">{t('cuisines.israeli')}</MenuItem>
          <MenuItem value="איטלקי">{t('cuisines.italian')}</MenuItem>
          <MenuItem value="אסייתי">{t('cuisines.asian')}</MenuItem>
          <MenuItem value="מזרח תיכוני">{t('cuisines.middleEastern')}</MenuItem>
          <MenuItem value="אמריקאי">{t('cuisines.american')}</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="dietary-restrictions-label">{t('recipe.dietaryRestrictions')}</InputLabel>
        <Select
          labelId="dietary-restrictions-label"
          id="recipe-dietaryRestrictions"
          name="dietaryRestrictions"
          multiple
          value={formData.dietaryRestrictions}
          onChange={handleChange}
          label={t('recipe.dietaryRestrictions')}
          renderValue={(selected) => (selected as string[]).join(', ')}
        >
          <MenuItem value="טבעוני">{t('dietary.vegan')}</MenuItem>
          <MenuItem value="צמחוני">{t('dietary.vegetarian')}</MenuItem>
          <MenuItem value="ללא גלוטן">{t('dietary.glutenFree')}</MenuItem>
          <MenuItem value="ללא לקטוז">{t('dietary.lactoseFree')}</MenuItem>
          <MenuItem value="כשר">{t('dietary.kosher')}</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

export default CategoryFields;

