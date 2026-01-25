// client/src/components/CategoryDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import CategoryIcon from '@mui/icons-material/Category';
import CloseIcon from '@mui/icons-material/Close';
import CategoryGrid from './CategoryGrid';

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectCategory: (category: string) => void;
}

const CategoryDialog: React.FC<CategoryDialogProps> = ({ open, onClose, onSelectCategory }) => {
  const { t } = useTranslation();
  const handleSelectCategory = (category: string) => {
    onSelectCategory(category);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CategoryIcon />
          {t('category.dialogTitle')}
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pb: 4 }}>
        <CategoryGrid onSelectCategory={handleSelectCategory} />
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;

