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

// ייבוא הקומפוננטות
import AppHeader from '../components/AppHeader';
import AddRecipeModal from '../components/AddRecipeModal';
import ViewRecipeModal from '../components/ViewRecipeModal'; // ייבוא קומפוננטת הצפייה
import SearchAndFilterSection from '../components/SearchAndFilterSection';
import RecipeList from '../components/RecipeList';
import AppFooter from '../components/AppFooter';
import type { IFullRecipeData, IRecipe } from '../types/Recipe';


// הגדרת מבנה לנתוני משתמש
interface UserData {
  id: string;
  username: string;
}

// הגדרת מבנה ל-props
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
    setError(null);
    try {
      const response = await apiClient.get('/recipes');
      setRecipes(response.data);
    } catch (err: any) {
      console.error('Error fetching recipes:', err);
      setError(err.response?.data?.message || 'אירעה שגיאה בטעינת המתכונים.');
    } finally {
      setIsLoadingRecipes(false);
    }, 1500);
  }, []);

  const handleOpenAddRecipeModal = () => {
    console.log('Opening Add Recipe Modal'); // לוודא שהפונקציה נקראת
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
        {isLoadingRecipes ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>טוען מתכונים...</Typography>
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ textAlign: 'center', my: 3 }}>
            שגיאה: {error}
          </Typography>
        ) : (
          <RecipeList
            recipes={recipes}
            isLoading={isLoadingRecipes}
            onOpenAddRecipeModal={handleOpenAddRecipeModal}
            onViewRecipe={handleViewRecipe}
            onEditRecipe={handleEditRecipe}
            onDeleteRecipe={handleDeleteRecipe}
          />
        )}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
          <Typography color="text.secondary">
            [Pagination במידת הצורך]
          </Typography>
        </Box>
      </Container>
      <AppFooter />

      {/* מודאל הוספת מתכון חדש */}
      <AddRecipeModal
        open={openAddRecipeModal}
        onClose={handleCloseAddRecipeModal}
        onAddRecipe={handleAddNewRecipe}
        initialRecipeData={null} // ודא שאין נתונים התחלתיים למצב הוספה
        onEditRecipe={undefined} // ודא ש-onEditRecipe אינו מוגדר למצב הוספה
      />

      {/* מודאל עריכת מתכון קיים */}
      {selectedRecipe && ( // ודא שיש מתכון שנבחר לעריכה
        <AddRecipeModal
          open={openEditRecipeModal}
          onClose={handleCloseEditRecipeModal}
          onAddRecipe={undefined} // ודא ש-onAddRecipe אינו מוגדר למצב עריכה
          onEditRecipe={handleUpdateRecipe}
          initialRecipeData={selectedRecipe} // העבר את נתוני המתכון לעריכה
        />
      )}

      {/* מודאל צפייה במתכון */}
      {selectedRecipe && ( // ודא שיש מתכון שנבחר לצפייה
        <ViewRecipeModal
          open={openViewRecipeModal}
          onClose={handleCloseViewRecipeModal}
          recipe={selectedRecipe}
        />
      )}
    </Box>
  );
};

export default DashboardPage;