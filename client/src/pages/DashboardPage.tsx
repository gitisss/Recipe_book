import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Paper,
  TextField,
  Chip,
  Divider,
  IconButton,
  CircularProgress, 
  Card,       
  CardContent,    
  CardActions   
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import GetAppIcon from '@mui/icons-material/GetApp';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


// הגדרת מבנה לנתוני משתמש
interface UserData {
  id: string;
  username: string;
}

// הגדרת מבנה ל-props שהקומפוננטה מקבלת
interface DashboardPageProps { // שיניתי את שם האינטרפייס להיות זהה למה שהיה ב-App.tsx
  currentUser: UserData | null;
  onLogout: () => void;
}

interface RecipePlaceholder {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}


const DashboardPage: React.FC<DashboardPageProps> = ({ currentUser, onLogout }) => {
  const [recipes, setRecipes] = useState<RecipePlaceholder[]>([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState<boolean>(false);

  useEffect(() => {
    setIsLoadingRecipes(true);
    const dummyRecipes: RecipePlaceholder[] = [
      { id: '1', name: 'עוגת גבינה', description: 'מתכון קלאסי ומרענן ללא אפייה.', imageUrl: 'https://via.placeholder.com/300x200.png?text=עוגת+גבינה' },
      { id: '2', name: 'קציצות בקר ברוטב עגבניות', description: 'מנה ביתית אהובה ומנחמת.', imageUrl: 'https://via.placeholder.com/300x200.png?text=קציצות+בקר' },
      { id: '3', name: 'סלט עדשים שחורות', description: 'סלט בריא, משביע וקל להכנה.', imageUrl: 'https://via.placeholder.com/300x200.png?text=סלט+עדשים' },
    ];
    setTimeout(() => {
      setRecipes(dummyRecipes);
      setIsLoadingRecipes(false);
    }, 1500);
  }, []);


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 1. סרגל עליון (AppBar) */}
      <AppBar position="static" sx={{ backgroundColor: 'primary.main' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ספר המתכונים שלי
          </Typography>
          {currentUser && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
                שלום, {currentUser.username}!
              </Typography>
              <Button color="inherit" onClick={onLogout}>
                התנתק
              </Button>
            </Box>
          )}
          {!currentUser && (
             <Button color="inherit" onClick={() => alert('ניווט לדף התחברות (לא מחובר כרגע)')}>
                התחבר
              </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* 2. קונטיינר ראשי לתוכן הדף */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        {/* 3. כותרת ראשית לדף */}
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
          לוח הבקרה שלי
        </Typography>

        {/* 4. אזור פעולות מהירות */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            startIcon={<AddCircleOutlineIcon />} 
            onClick={() => alert('Placeholder: הוסף מתכון חדש')}
          >
            הוסף מתכון חדש
          </Button>
          <Button 
            variant="outlined" 
            color="primary" 
            size="large"
            startIcon={<GetAppIcon />} 
            onClick={() => alert('Placeholder: ייבא מתכון')}
          >
            ייבא מתכון
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* 5. אזור חיפוש וסינון */}
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>חיפוש וסינון</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              label="חפש מתכונים..."
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
              }}
              sx={{ flexGrow: 1, minWidth: '200px' }}
            />
            <Button variant="text" startIcon={<FilterListIcon />}>
              סנן (Placeholder)
            </Button>
          </Box>
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label="קטגוריה 1 (Placeholder)" onClick={() => {}} />
            <Chip label="קטגוריה 2 (Placeholder)" onClick={() => {}} />
            <Chip label="מועדפים (Placeholder)" variant="outlined" onClick={() => {}} />
          </Box>
        </Paper>
        
        <Divider sx={{ my: 3 }} />

        {/* 6. אזור הצגת התוכן הראשי (למתכונים) */}
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2 }}>
          המתכונים שלך
        </Typography>
        
        {isLoadingRecipes ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>טוען מתכונים...</Typography>
          </Box>
        ) : recipes.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                {recipes.map(recipe => (
                    <Card key={recipe.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 11px)'}, display: 'flex', flexDirection: 'column' }} elevation={3}>
                        {recipe.imageUrl && (
                            <Box 
                                component="img"
                                sx={{
                                height: 180,
                                width: '100%',
                                objectFit: 'cover',
                                }}
                                alt={`תמונה של ${recipe.name}`}
                                src={recipe.imageUrl}
                            />
                        )}
                        {!recipe.imageUrl && (
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
                                {recipe.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {recipe.description}
                            </Typography>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'space-between', p:1 }}>
                            <Button size="small" startIcon={<VisibilityIcon />} onClick={() => alert(`צפייה במתכון: ${recipe.name}`)}>צפה</Button>
                            <Box>
                                <IconButton size="small" onClick={() => alert(`עריכת מתכון: ${recipe.name}`)}><EditIcon fontSize="small"/></IconButton>
                                <IconButton size="small" onClick={() => alert(`מחיקת מתכון: ${recipe.name}`)}><DeleteIcon fontSize="small"/></IconButton>
                            </Box>
                        </CardActions>
                    </Card>
                ))}
            </Box>
        ) : (
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center', backgroundColor: 'grey.100' }}>
            <Typography variant="body1" color="text.secondary">
              עדיין לא הוספת מתכונים.
              <Button variant="text" startIcon={<AddCircleOutlineIcon />} sx={{ml:1}} onClick={() => alert('Placeholder: הוסף מתכון חדש')}>
                הוסף את המתכון הראשון שלך!
              </Button>
            </Typography>
          </Paper>
        )}

        {/* 7. אזור פגינציה (Placeholder) */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
          <Typography color="text.secondary">
            [Pagination במידת הצורך]
          </Typography>
        </Box>

      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            {'© '}
            ספר המתכונים שלי {new Date().getFullYear()}
            {'.'}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardPage;
