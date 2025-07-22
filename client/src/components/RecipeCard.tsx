// client/src/components/RecipeCard.tsx
import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Avatar
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface RecipeCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: (string) | string) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  id,
  title,
  description,
  imageUrl,
  onView,
  onEdit,
  onDelete
}) => {
  const getFallbackImage = () => {
    const firstLetter = title ? title.charAt(0).toUpperCase() : '';
    return (
      <Avatar
        sx={{
          bgcolor: (theme) => theme.palette.secondary.main,
          width: 80,
          height: 80,
          fontSize: '3rem',
          color: 'white',
        }}
      >
        {firstLetter}
      </Avatar>
    );
  };

  return (
    <Card sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 11px)'}, display: 'flex', flexDirection: 'column' }} elevation={3}>
      {imageUrl ? (
        <Box
          component="img"
          sx={{
            height: 180,
            width: '100%',
            objectFit: 'cover',
          }}
          alt={`תמונה של ${title}`}
          src={imageUrl}
        />
      ) : (
        <Box
          sx={{
            height: 180,
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
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', p:1 }}>
        <Button size="small" startIcon={<VisibilityIcon />} onClick={() => onView(id)}>צפה</Button>
        <Box>
          <IconButton size="small" onClick={() => onEdit(id)}><EditIcon fontSize="small"/></IconButton>
          <IconButton size="small" onClick={() => onDelete(id)}><DeleteIcon fontSize="small"/></IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};

export default RecipeCard;