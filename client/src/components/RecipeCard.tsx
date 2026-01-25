// client/src/components/RecipeCard.tsx
import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RecipeImageDisplay from './recipeCard/RecipeImageDisplay';

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
  return (
    <Card
      onClick={() => onView(id)}
      sx={{
        width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 11px)' },
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 280,
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out'
        }
      }}
      elevation={2}
    >
      <RecipeImageDisplay imageUrl={imageUrl} title={title} />
      <CardContent sx={{ flexGrow: 1, p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Typography gutterBottom variant="subtitle1" component="div" sx={{ fontSize: '0.95rem', fontWeight: 600, mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {description}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', p: 0.5, px: 1 }}>
        <Button size="small" startIcon={<VisibilityIcon />} onClick={(e) => { e.stopPropagation(); onView(id); }} sx={{ fontSize: '0.75rem' }}>צפה</Button>
        <Box>
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); onEdit(id); }} sx={{ p: 0.5 }}><EditIcon fontSize="small" /></IconButton>
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDelete(id); }} sx={{ p: 0.5 }}><DeleteIcon fontSize="small" /></IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};

export default RecipeCard;