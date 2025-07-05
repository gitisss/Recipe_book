// client/src/pages/DashboardPage.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  Divider,
  Button,
  CircularProgress
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
import apiClient from '../apiClient'; // ייבוא apiClient


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
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openAddRecipeModal, setOpenAddRecipeModal] = useState<boolean>(false);

  // מצבים עבור צפייה ועריכה
  const [openViewRecipeModal, setOpenViewRecipeModal] = useState<boolean>(false);
  const [selectedRecipe, setSelectedRecipe] = useState<IRecipe | null>(null); // המתכון לצפייה/עריכה
  const [openEditRecipeModal, setOpenEditRecipeModal] = useState<boolean>(false);


  // פונקציה לשליפת מתכונים מהשרת
  const fetchRecipes = useCallback(async () => {
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
    }
  }, []);

  // קריאה לפונקציה בעת טעינת הקומפוננטה
  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleOpenAddRecipeModal = () => {
    console.log('Opening Add Recipe Modal'); // לוודא שהפונקציה נקראת
    setOpenAddRecipeModal(true);
  };

  const handleCloseAddRecipeModal = () => {
    setOpenAddRecipeModal(false);
  };

  // פונקציה לטיפול בהוספת מתכון חדש - תשלח לשרת
  const handleAddNewRecipe = useCallback(async (recipeData: IFullRecipeData) => {
    try {
      await apiClient.post('/recipes', recipeData);
      alert('מתכון נוצר בהצלחה!');
      handleCloseAddRecipeModal();
      fetchRecipes(); // רענן את רשימת המתכונים לאחר הוספה מוצלחת
    } catch (err: any) {
      console.error('Error creating recipe:', err);
      alert(err.response?.data?.message || 'אירעה שגיאה ביצירת המתכון.');
    }
  }, [fetchRecipes]);

  // פונקציה לטיפול בצפייה במתכון
  const handleViewRecipe = useCallback(async (id: string) => {
    try {
      const response = await apiClient.get(`/recipes/${id}`);
      setSelectedRecipe(response.data);
      setOpenViewRecipeModal(true);
    } catch (err: any) {
      console.error('Error fetching recipe for view:', err);
      alert(err.response?.data?.message || 'אירעה שגיאה בטעינת פרטי המתכון.');
    }
  }, []);

  const handleCloseViewRecipeModal = () => {
    setOpenViewRecipeModal(false);
    setSelectedRecipe(null);
  };

  // פונקציה לטיפול בעריכת מתכון (פתיחת מודאל עם נתונים)
  const handleEditRecipe = useCallback(async (id: string) => {
    try {
      const response = await apiClient.get(`/recipes/${id}`);
      setSelectedRecipe(response.data); // השתמש ב-selectedRecipe כדי להעביר את נתוני המתכון למודאל העריכה
      setOpenEditRecipeModal(true);
    } catch (err: any) {
      console.error('Error fetching recipe for edit:', err);
      alert(err.response?.data?.message || 'אירעה שגיאה בטעינת המתכון לעריכה.');
    }
  }, []);

  // פונקציה לטיפול בעדכון מתכון (שליחת PUT לשרת)
  const handleUpdateRecipe = useCallback(async (id: string, recipeData: IFullRecipeData) => {
    try {
      await apiClient.put(`/recipes/${id}`, recipeData);
      alert('מתכון עודכן בהצלחה!');
      setOpenEditRecipeModal(false); // סגור את מודאל העריכה
      setSelectedRecipe(null); // נקה את המתכון שנבחר
      fetchRecipes(); // רענן את רשימת המתכונים
    } catch (err: any) {
      console.error('Error updating recipe:', err);
      alert(err.response?.data?.message || 'אירעה שגיאה בעדכון המתכון.');
    }
  }, [fetchRecipes]);

  const handleCloseEditRecipeModal = () => {
    setOpenEditRecipeModal(false);
    setSelectedRecipe(null); // נקה את המתכון שנבחר
  };


  const handleDeleteRecipe = useCallback(async (id: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק מתכון זה?')) {
      try {
        await apiClient.delete(`/recipes/${id}`);
        alert('מתכון נמחק בהצלחה!');
        fetchRecipes(); // רענן את רשימת המתכונים לאחר מחיקה מוצלחת
      } catch (err: any) {
        console.error('Error deleting recipe:', err);
        alert(err.response?.data?.message || 'אירעה שגיאה במחיקת המתכון.');
      }
    }
  }, [fetchRecipes]);

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