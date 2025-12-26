// client/src/components/recipeView/RecipeImage.tsx
import React from 'react';
import { Box } from '@mui/material';

interface RecipeImageProps {
  imageUrl?: string;
  title: string;
}

const RecipeImage: React.FC<RecipeImageProps> = ({ imageUrl, title }) => {
  if (!imageUrl) {
    return null;
  }

  return (
    <Box sx={{ mb: 2, textAlign: 'center' }}>
      <img
        src={imageUrl}
        alt={title}
        style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px' }}
      />
    </Box>
  );
};

export default RecipeImage;

