// client/src/pages/DashboardPage.tsx
import React, { useEffect, useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  Divider,
  Button,
  CircularProgress,
  TextField,
  Tabs,
  Tab,
  InputAdornment
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';

import AppHeader from '../components/AppHeader';
import AddRecipeModal from '../components/AddRecipeModal';
import ViewRecipeModal from '../components/ViewRecipeModal';
import RecipeList from '../components/RecipeList';
import AppFooter from '../components/AppFooter';
import CategoryGrid from '../components/CategoryGrid';
import type { IFullRecipeData } from '../types/Recipe';
import apiClient from '../apiClient';
import { useRecipes } from '../hooks/useRecipes';
import { useRecipeModals } from '../hooks/useRecipeModals';
import { useRecipeFilters } from '../hooks/useRecipeFilters';

interface UserData {
  id: string;
  username: string;
}

interface DashboardPageProps {
  currentUser: UserData | null;
  onLogout: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ currentUser, onLogout }) => {
  const {
    recipes,
    isLoadingRecipes,
    error,
    fetchRecipes,
    deleteRecipe,
    getRecipeById,
  } = useRecipes();

  const {
    openAddRecipeModal,
    openViewRecipeModal,
    openEditRecipeModal,
    selectedRecipe,
    handleOpenAddRecipeModal,
    handleCloseAddRecipeModal,
    handleViewRecipe: handleViewRecipeModal,
    handleCloseViewRecipeModal,
    handleEditRecipe: handleEditRecipeModal,
    handleCloseEditRecipeModal,
  } = useRecipeModals();

  const {
    selectedCategory,
    searchQuery,
    activeTab,
    setActiveTab,
    handleSelectCategory,
    handleSearchChange,
  } = useRecipeFilters();

  useEffect(() => {
    fetchRecipes(selectedCategory || undefined, searchQuery);
  }, [fetchRecipes, selectedCategory, searchQuery]);

  const handleAddNewRecipe = useCallback(async (recipeData: IFullRecipeData) => {
    try {
      await apiClient.post('/recipes', recipeData);
      alert('מתכון נוצר בהצלחה!');
      handleCloseAddRecipeModal();
      fetchRecipes(selectedCategory || undefined, searchQuery);
    } catch (err: any) {
      console.error('Error creating recipe:', err);
      alert(err.response?.data?.message || 'אירעה שגיאה ביצירת המתכון.');
    }
  }, [fetchRecipes, selectedCategory, searchQuery, handleCloseAddRecipeModal]);

  const handleViewRecipe = useCallback(async (id: string) => {
    try {
      const recipe = await getRecipeById(id);
      handleViewRecipeModal(recipe);
    } catch (err: any) {
      alert(err.message || 'אירעה שגיאה בטעינת פרטי המתכון.');
    }
  }, [getRecipeById, handleViewRecipeModal]);

  const handleEditRecipe = useCallback(async (id: string) => {
    try {
      const recipe = await getRecipeById(id);
      handleEditRecipeModal(recipe);
    } catch (err: any) {
      alert(err.message || 'אירעה שגיאה בטעינת המתכון לעריכה.');
    }
  }, [getRecipeById, handleEditRecipeModal]);

  const handleUpdateRecipe = useCallback(async (id: string, recipeData: IFullRecipeData) => {
    try {
      await apiClient.put(`/recipes/${id}`, recipeData);
      alert('מתכון עודכן בהצלחה!');
      handleCloseEditRecipeModal();
      fetchRecipes(selectedCategory || undefined, searchQuery);
    } catch (err: any) {
      console.error('Error updating recipe:', err);
      alert(err.response?.data?.message || 'אירעה שגיאה בעדכון המתכון.');
    }
  }, [fetchRecipes, selectedCategory, searchQuery, handleCloseEditRecipeModal]);

  const handleDeleteRecipe = useCallback(async (id: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק מתכון זה?')) {
      try {
        await deleteRecipe(id);
        alert('מתכון נמחק בהצלחה!');
        fetchRecipes(selectedCategory || undefined, searchQuery);
      } catch (err: any) {
        alert(err.message || 'אירעה שגיאה במחיקת המתכון.');
      }
    }
  }, [deleteRecipe, fetchRecipes, selectedCategory, searchQuery]);



  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppHeader currentUser={currentUser} onLogout={onLogout} />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
          המתכונים שלי
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => {
              console.log('Opening Add Recipe Modal');
              handleOpenAddRecipeModal();
            }}
          >
            הוסף מתכון חדש
          </Button>
        </Box>
        <Divider sx={{ my: 3 }} />

        {/* לשוניות ניווט */}
        <Tabs value={activeTab} onChange={(event, newValue) => setActiveTab(newValue)} centered sx={{ mb: 3 }}>
          <Tab label="מתכונים" value="recipes" />
          <Tab label="קטגוריות" value="categories" />
        </Tabs>

        {/* תוכן הלשונית הפעילה */}
        {activeTab === 'recipes' && (
          <Box>
            {/* שדה החיפוש */}
            <Box sx={{ mb: 3 }}>
              <TextField
                label="חפש מתכונים..."
                variant="outlined"
                fullWidth
                size="small"
                value={searchQuery}
                onChange={handleSearchChange}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'action.active' }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            {/* כותרת קטגוריה אם נבחרה */}
            {selectedCategory && (
                <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2 }}>
                    מתכונים בקטגוריה: {selectedCategory}
                </Typography>
            )}

            {isLoadingRecipes ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>טוען מתכונים...</Typography>
              </Box>
            ) : error ? (
              <Typography color="error" sx={{ textAlign: 'center', my: 3 }}>
                שגיאה: {error}
              </Typography>
            ) : recipes.length > 0 ? (
              <RecipeList
                recipes={recipes}
                isLoading={isLoadingRecipes}
                onOpenAddRecipeModal={handleOpenAddRecipeModal}
                onViewRecipe={handleViewRecipe}
                onEditRecipe={handleEditRecipe}
                onDeleteRecipe={handleDeleteRecipe}
              />
            ) : (searchQuery || selectedCategory) ? (
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 3 }}>
                  לא נמצאו מתכונים עבור החיפוש/קטגוריה הנוכחיים.
              </Typography>
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 3 }}>
                 עדיין לא הוספת מתכונים. התחל על ידי הוספת מתכון חדש!
              </Typography>
            )}
          </Box>
        )}

        {activeTab === 'categories' && (
          <Box>
            <CategoryGrid onSelectCategory={handleSelectCategory} />
          </Box>
        )}
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