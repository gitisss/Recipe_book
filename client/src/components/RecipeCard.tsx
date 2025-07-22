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

// הגדרת הממשק ל-props של קומפוננטת RecipeCard
interface RecipeCardProps {
  id: string;
  title: string; // <-- שונה מ-name ל-title
  description: string;
  imageUrl?: string;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  id,
  title, // <-- שונה מ-name ל-title
  description,
  imageUrl,
  onView,
  onEdit,
  onDelete
}) => {
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
          alt={`תמונה של ${title}`} // <-- שונה מ-name ל-title
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
          <Typography variant="caption">אין תמונה</Typography>
        </Box>
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {title} {/* <-- שונה מ-name ל-title */}
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