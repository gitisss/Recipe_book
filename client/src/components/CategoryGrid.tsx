// client/src/components/CategoryGrid.tsx
import React from 'react';
import { Box, Card, CardContent, Typography, ButtonBase, Avatar } from '@mui/material';

import RestaurantIcon from '@mui/icons-material/Restaurant';
import CakeIcon from '@mui/icons-material/Cake';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import CategoryIcon from '@mui/icons-material/Category';
import Grid from '@mui/material/Grid';


interface CategoryGridProps {
  onSelectCategory: (category: string) => void;
}

const categories = [
  { name: 'עיקרית', icon: RestaurantIcon },
  { name: 'קינוח', icon: CakeIcon },
  { name: 'ארוחת בוקר', icon: LocalCafeIcon },
  { name: 'מרק', icon: SoupKitchenIcon },
  { name: 'סלט', icon: LocalDiningIcon },
  { name: 'מאפה', icon: BakeryDiningIcon },
  { name: 'ללא קטגוריה', icon: CategoryIcon },
];

const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  return (
    <Box sx={{ my: 2 }}>
      <Grid container spacing={2} justifyContent="center">
        {categories.map((cat) => {
          const IconComponent = cat.icon;

          return (
            <Grid xs={12} sm={6} md={4} lg={3} key={cat.name}>
              <ButtonBase
                onClick={() => onSelectCategory(cat.name)}
                sx={{
                  width: '100%',
                  display: 'block',
                  textAlign: 'initial',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3,
                    height: 150,
                    transition: '0.3s',
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-5px)',
                    },
                  }}
                  elevation={3}
                >
                  <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, mb: 1 }}>
                    <IconComponent sx={{ fontSize: 40, color: 'white' }} />
                  </Avatar>
                  <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                      {cat.name}
                    </Typography>
                  </CardContent>
                </Card>
              </ButtonBase>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default CategoryGrid;