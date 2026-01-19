// client/src/components/recipeCard/RecipeImageDisplay.tsx
import React from 'react';
import { Box, Avatar } from '@mui/material';

interface RecipeImageDisplayProps {
  imageUrl?: string;
  title: string;
}

const RecipeImageDisplay: React.FC<RecipeImageDisplayProps> = ({ imageUrl, title }) => {
  const getFallbackImage = () => {
    const firstLetter = title ? title.charAt(0).toUpperCase() : '';
    return (
      <Avatar
        sx={{
          bgcolor: (theme) => theme.palette.secondary.main,
          width: 60,
          height: 60,
          fontSize: '2rem',
          color: 'white',
        }}
      >
        {firstLetter}
      </Avatar>
    );
  };

  if (imageUrl) {
    return (
      <Box
        component="img"
        sx={{
          height: 120,
          width: '100%',
          objectFit: 'cover',
        }}
        alt={`תמונה של ${title}`}
        src={imageUrl}
      />
    );
  }

  return (
    <Box
      sx={{
        height: 120,
        width: '100%',
        backgroundColor: 'grey.200',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'text.secondary'
      }}
    >
      {getFallbackImage()}
    </Box>
  );
};

export default RecipeImageDisplay;

