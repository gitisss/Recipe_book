// client/src/pages/DashboardPage.tsx
import React, { useEffect, useState, useCallback } from 'react'; // הוסף useCallback
import {
  Container,
  Box,
  Typography,
  Divider,
  Button,
  CircularProgress // הוסף CircularProgress
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// ייבוא הקומפוננטות החדשות
import AppHeader from '../components/AppHeader';
import AddRecipeModal from '../components/AddRecipeModal';
import SearchAndFilterSection from '../components/SearchAndFilterSection';
import RecipeList from '../components/RecipeList';
import AppFooter from '../components/AppFooter';
import type { IFullRecipeData, IRecipe } from '../types/Recipe';
import apiClient from '../apiClient'; // ייבוא apiClient


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
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState<boolean>(true); // שינוי ל-true כדי להציג טעינה בהתחלה
  const [error, setError] = useState<string | null>(null); // הוסף מצב שגיאה
  const [openAddRecipeModal, setOpenAddRecipeModal] = useState<boolean>(false);

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
  }, []); // ללא תלויות, תיקרא פעם אחת בטעינה

  // קריאה לפונקציה בעת טעינת הקומפוננטה
  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]); // ודא ש-fetchRecipes תלוי כאן, למרות שהוא useCallback ללא תלויות

  const handleOpenAddRecipeModal = () => {
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
  }, [fetchRecipes]); // תלוי ב-fetchRecipes כדי לרענן

  const handleViewRecipe = (id: string) => {
    alert(`צפייה במתכון: ${id}`);
    // כאן נממש בעתיד ניווט לדף פרטי מתכון או מודאל תצוגה
  };

  const handleEditRecipe = (id: string) => {
    alert(`עריכת מתכון: ${id}`);
    // כאן נממש בעתיד טעינת נתוני המתכון למודאל עריכה ושליחת PUT
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
  }, [fetchRecipes]); // תלוי ב-fetchRecipes כדי לרענן

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
      <AddRecipeModal
        open={openAddRecipeModal}
        onClose={handleCloseAddRecipeModal}
        onAddRecipe={handleAddNewRecipe}
      />
    </Box>
  );
};

export default DashboardPage;