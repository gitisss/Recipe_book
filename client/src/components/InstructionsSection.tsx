// client/src/components/InstructionsSection.tsx
import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface InstructionsSectionProps {
  instructions: string[];
  handleInstructionChange: (index: number, value: string) => void;
  addInstructionField: () => void;
  removeInstructionField: (index: number) => void;
}

const InstructionsSection: React.FC<InstructionsSectionProps> = ({
  instructions,
  handleInstructionChange,
  addInstructionField,
  removeInstructionField,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        {t('recipe.instructions')}
      </Typography>
      {instructions.map((instruction, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
          <TextField
            fullWidth
            id={`instruction-${index}`}
            label={`${t('recipe.step')} ${index + 1}`}
            value={instruction}
            onChange={(e) =>
              handleInstructionChange(index, e.target.value)
            }
            multiline
            rows={1}
          />
          <IconButton
            onClick={() => removeInstructionField(index)}
            color="error"
            disabled={instructions.length === 1 && index === 0}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
      <Button startIcon={<AddIcon />} onClick={addInstructionField} sx={{ mt: 1 }}>
        {t('recipe.addStep')}
      </Button>
    </>
  );
};

export default InstructionsSection;