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

import AppHeader from '../components/AppHeader';
import AddRecipeModal from '../components/AddRecipeModal';
import ViewRecipeModal from '../components/ViewRecipeModal';
import SearchAndFilterSection from '../components/SearchAndFilterSection';
import RecipeList from '../components/RecipeList';
import AppFooter from '../components/AppFooter';
import type { IFullRecipeData, IRecipe } from '../types/Recipe';
import apiClient from '../apiClient';

interface UserData {
  id: string;
  username: string;
}

interface DashboardPageProps {
  currentUser: UserData | null;
  onLogout: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ currentUser, onLogout }) => {
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openAddRecipeModal, setOpenAddRecipeModal] = useState<boolean>(false);

  const [openViewRecipeModal, setOpenViewRecipeModal] = useState<boolean>(false);
  const [selectedRecipe, setSelectedRecipe] = useState<IRecipe | null>(null);
  const [openEditRecipeModal, setOpenEditRecipeModal] = useState<boolean>(false);


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

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleOpenAddRecipeModal = () => {
    console.log('Opening Add Recipe Modal');
    setOpenAddRecipeModal(true);
  };

  const handleCloseAddRecipeModal = () => {
    setOpenAddRecipeModal(false);
  };

  const handleAddNewRecipe = useCallback(async (recipeData: IFullRecipeData) => {
    try {
      await apiClient.post('/recipes', recipeData);
      alert('מתכון נוצר בהצלחה!');
      handleCloseAddRecipeModal();
      fetchRecipes();
    } catch (err: any) {
      console.error('Error creating recipe:', err);
      alert(err.response?.data?.message || 'אירעה שגיאה ביצירת המתכון.');
    }
  }, [fetchRecipes]);

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

  const handleEditRecipe = useCallback(async (id: string) => {
    try {
      const response = await apiClient.get(`/recipes/${id}`);
      setSelectedRecipe(response.data); 
      setOpenEditRecipeModal(true);
    } catch (err: any) {
      console.error('Error fetching recipe for edit:', err);
      alert(err.response?.data?.message || 'אירעה שגיאה בטעינת המתכון לעריכה.');
    }
  }, []);

  const handleUpdateRecipe = useCallback(async (id: string, recipeData: IFullRecipeData) => {
    try {
      await apiClient.put(`/recipes/${id}`, recipeData);
      alert('מתכון עודכן בהצלחה!');
      setOpenEditRecipeModal(false);
      setSelectedRecipe(null);
      fetchRecipes();
    } catch (err: any) {
      console.error('Error updating recipe:', err);
      alert(err.response?.data?.message || 'אירעה שגיאה בעדכון המתכון.');
    }
  }, [fetchRecipes]);

  const handleCloseEditRecipeModal = () => {
    setOpenEditRecipeModal(false);
    setSelectedRecipe(null);
  };


  const handleDeleteRecipe = useCallback(async (id: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק מתכון זה?')) {
      try {
        await apiClient.delete(`/recipes/${id}`);
        alert('מתכון נמחק בהצלחה!');
        fetchRecipes();
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
        {/* הפלייסהולדר לפגינציה הוסר אוטומטית */}
      </Container>
      <AppFooter />

      <AddRecipeModal
        open={openAddRecipeModal}
        onClose={handleCloseAddRecipeModal}
        onAddRecipe={handleAddNewRecipe}
        initialRecipeData={null}
        onEditRecipe={undefined}
      />

      {selectedRecipe && (
        <AddRecipeModal
          open={openEditRecipeModal}
          onClose={handleCloseEditRecipeModal}
          onAddRecipe={undefined}
          onEditRecipe={handleUpdateRecipe}
          initialRecipeData={selectedRecipe}
        />
      )}

      {selectedRecipe && (
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