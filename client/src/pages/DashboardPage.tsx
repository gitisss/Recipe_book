// client/src/pages/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Divider,
  Button
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// ייבוא הקומפוננטות החדשות
import AppHeader from '../components/AppHeader';
import AddRecipeModal from '../components/AddRecipeModal';
import SearchAndFilterSection from '../components/SearchAndFilterSection';
import RecipeList from '../components/RecipeList';
import AppFooter from '../components/AppFooter';
import type { IFullRecipeData, IRecipe } from '../types/Recipe';



// הגדרת מבנה לנתוני משתמש (נשאר כאן כי הוא ספציפי ליוזר לוגד אין)
interface UserData {
  id: string;
  username: string;
}

// הגדרת מבנה ל-props שהקומפוננטה מקבלת
interface DashboardPageProps {
  currentUser: UserData | null;
  onLogout: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ currentUser, onLogout }) => {
  const [recipes, setRecipes] = useState<IRecipe[]>([]); // השתמש ב-IRecipe
  const [isLoadingRecipes, setIsLoadingRecipes] = useState<boolean>(false);
  const [openAddRecipeModal, setOpenAddRecipeModal] = useState<boolean>(false);

  useEffect(() => {
    setIsLoadingRecipes(true);
    // זו עדיין הדמיה, בהמשך נחליף בקריאת API אמיתית
    const dummyRecipes: IRecipe[] = [ // השתמש ב-IRecipe גם כאן
      { _id: '1', name: 'עוגת גבינה', description: 'מתכון קלאסי ומרענן ללא אפייה.', imageUrl: 'https://via.placeholder.com/300x200.png?text=עוגת+גבינה', instructions: 'אופים...', ingredients: [], owner: 'dummy_user', createdAt: '2023-01-01', updatedAt: '2023-01-01' },
      { _id: '2', name: 'קציצות בקר ברוטב עגבניות', description: 'מנה ביתית אהובה ומנחמת.', imageUrl: 'https://via.placeholder.com/300x200.png?text=קציצות+בקר', instructions: 'מטגנים...', ingredients: [], owner: 'dummy_user', createdAt: '2023-01-01', updatedAt: '2023-01-01' },
      { _id: '3', name: 'סלט עדשים שחורות', description: 'סלט בריא, משביע וקל להכנה.', imageUrl: 'https://via.placeholder.com/300x200.png?text=סלט+עדשים', instructions: 'מערבבים...', ingredients: [], owner: 'dummy_user', createdAt: '2023-01-01', updatedAt: '2023-01-01' },
    ];
    setTimeout(() => {
      setRecipes(dummyRecipes);
      setIsLoadingRecipes(false);
    }, 1500);
  }, []);

  const handleOpenAddRecipeModal = () => {
    setOpenAddRecipeModal(true);
  };

  const handleCloseAddRecipeModal = () => {
    setOpenAddRecipeModal(false);
  };

  const handleAddNewRecipe = (recipeData: IFullRecipeData) => { // השתמש ב-IFullRecipeData
    console.log('מתכון חדש ליצירה:', recipeData);
    alert(`Placeholder: יוצר מתכון חדש בשם: ${recipeData.name}`);
    handleCloseAddRecipeModal();
  };

  const handleViewRecipe = (id: string) => {
    alert(`צפייה במתכון: ${id}`);
  };

  const handleEditRecipe = (id: string) => {
    alert(`עריכת מתכון: ${id}`);
  };

  const handleDeleteRecipe = (id: string) => {
    alert(`מחיקת מתכון: ${id}`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppHeader currentUser={currentUser} onLogout={onLogout} />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
          לוח הבקרה שלי
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleOpenAddRecipeModal}
          >
            הוסף מתכון חדש
          </Button>
        </Box>
        <Divider sx={{ my: 3 }} />
        <SearchAndFilterSection />
        <Divider sx={{ my: 3 }} />
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2 }}>
          המתכונים שלך
        </Typography>
        <RecipeList
          recipes={recipes}
          isLoading={isLoadingRecipes}
          onOpenAddRecipeModal={handleOpenAddRecipeModal}
          onViewRecipe={handleViewRecipe}
          onEditRecipe={handleEditRecipe}
          onDeleteRecipe={handleDeleteRecipe}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
          <Typography color="text.secondary">
            [Pagination במידת הצורך]
          </Typography>
        </Box>
      </Container>
      <AppFooter />
      <AddRecipeModal
        open={openAddRecipeModal}
        onClose={handleCloseAddRecipeModal}
        onAddRecipe={handleAddNewRecipe}
      />
    </Box>
  );
};

export default DashboardPage;