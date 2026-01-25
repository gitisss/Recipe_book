// client/src/pages/DashboardPage.tsx
import React, { useEffect, useCallback, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Divider,
  CircularProgress,
  IconButton,
  Fab
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CategoryIcon from '@mui/icons-material/Category';

import AddRecipeModal from '../components/AddRecipeModal';
import ViewRecipeModal from '../components/ViewRecipeModal';
import RecipeList from '../components/RecipeList';
import SearchDialog from '../components/SearchDialog';
import CategoryDialog from '../components/CategoryDialog';
import type { IFullRecipeData } from '../types/Recipe';
import apiClient from '../apiClient';
import { useRecipes } from '../hooks/useRecipes';
import { useRecipeModals } from '../hooks/useRecipeModals';
import { useRecipeFilters } from '../hooks/useRecipeFilters';


const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
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
    handleSelectCategory,
    setSearchQueryDirect,
  } = useRecipeFilters();

  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

  useEffect(() => {
    fetchRecipes(selectedCategory || undefined, searchQuery);
  }, [fetchRecipes, selectedCategory, searchQuery]);

  const handleAddNewRecipe = useCallback(async (recipeData: IFullRecipeData) => {
    try {
      await apiClient.post('/recipes', recipeData);
      alert(t('dashboard.createSuccess'));
      handleCloseAddRecipeModal();
      fetchRecipes(selectedCategory || undefined, searchQuery);
    } catch (err: any) {
      console.error('Error creating recipe:', err);
      alert(err.response?.data?.message || t('recipe.saveError'));
    }
  }, [fetchRecipes, selectedCategory, searchQuery, handleCloseAddRecipeModal]);

  const handleViewRecipe = useCallback(async (id: string) => {
    try {
      const recipe = await getRecipeById(id);
      handleViewRecipeModal(recipe);
    } catch (err: any) {
      alert(err.message || t('dashboard.recipeLoadError'));
    }
  }, [getRecipeById, handleViewRecipeModal]);

  const handleEditRecipe = useCallback(async (id: string) => {
    try {
      const recipe = await getRecipeById(id);
      handleEditRecipeModal(recipe);
    } catch (err: any) {
      alert(err.message || t('dashboard.recipeEditLoadError'));
    }
  }, [getRecipeById, handleEditRecipeModal]);

  const handleUpdateRecipe = useCallback(async (id: string, recipeData: IFullRecipeData) => {
    try {
      await apiClient.put(`/recipes/${id}`, recipeData);
      alert(t('dashboard.updateSuccess'));
      handleCloseEditRecipeModal();
      fetchRecipes(selectedCategory || undefined, searchQuery);
    } catch (err: any) {
      console.error('Error updating recipe:', err);
      alert(err.response?.data?.message || t('recipe.saveError'));
    }
  }, [fetchRecipes, selectedCategory, searchQuery, handleCloseEditRecipeModal]);

  const handleDeleteRecipe = useCallback(async (id: string) => {
    if (window.confirm(t('dashboard.deleteConfirm'))) {
      try {
        await deleteRecipe(id);
        alert(t('dashboard.deleteSuccess'));
        fetchRecipes(selectedCategory || undefined, searchQuery);
      } catch (err: any) {
        alert(err.message || t('dashboard.deleteError'));
      }
    }
  }, [deleteRecipe, fetchRecipes, selectedCategory, searchQuery]);



  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, pt: 2, pb: 2, position: 'relative', overflow: 'hidden' }}>
          <Divider sx={{ mb: 2 }} />

          {/* כפתורים עגולים למעלה */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, mb: 2, alignItems: 'center' }}>
            {/* כפתור חיפוש */}
            <IconButton
              color="primary"
              onClick={() => setSearchDialogOpen(true)}
              sx={{
                width: 56,
                height: 56,
                bgcolor: 'background.paper',
                border: '2px solid',
                borderColor: 'primary.main',
                boxShadow: 2,
                '&:hover': {
                  bgcolor: 'primary.light',
                  borderColor: 'primary.dark',
                  boxShadow: 4,
                }
              }}
            >
              <SearchIcon fontSize="medium" />
            </IconButton>

            {/* כפתור קטגוריות */}
            <IconButton
              color="primary"
              onClick={() => setCategoryDialogOpen(true)}
              sx={{
                width: 56,
                height: 56,
                bgcolor: 'background.paper',
                border: '2px solid',
                borderColor: 'primary.main',
                boxShadow: 2,
                '&:hover': {
                  bgcolor: 'primary.light',
                  borderColor: 'primary.dark',
                  boxShadow: 4,
                }
              }}
            >
              <CategoryIcon fontSize="medium" />
            </IconButton>

            {/* כפתור הוספת מתכון - בולט יותר */}
            <Fab
              color="primary"
              aria-label={t('dashboard.addRecipe')}
              onClick={() => {
                console.log('Opening Add Recipe Modal');
                handleOpenAddRecipeModal();
              }}
              sx={{
                width: 56,
                height: 56,
                boxShadow: 4,
                '&:hover': {
                  boxShadow: 8,
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s',
              }}
            >
              <AddIcon />
            </Fab>

            {/* הצגת פילטרים פעילים */}
            {(selectedCategory || searchQuery) && (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: 'auto' }}>
                {selectedCategory && (
                  <Typography variant="body2" sx={(theme) => ({
                    px: 1.5,
                    py: 0.5,
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.15)' : 'primary.light',
                    border: theme.palette.mode === 'dark' ? '1px solid rgba(144, 202, 249, 0.3)' : 'none',
                    borderRadius: 1,
                    color: theme.palette.mode === 'dark' ? 'primary.main' : 'primary.contrastText',
                    fontWeight: 500
                  })}>
                    {t('dashboard.category')} {selectedCategory}
                  </Typography>
                )}
                {searchQuery && (
                  <Typography variant="body2" sx={(theme) => ({
                    px: 1.5,
                    py: 0.5,
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(77, 182, 172, 0.15)' : 'primary.light',
                    border: theme.palette.mode === 'dark' ? '1px solid rgba(77, 182, 172, 0.3)' : 'none',
                    borderRadius: 1,
                    color: theme.palette.mode === 'dark' ? 'secondary.main' : 'primary.contrastText',
                    fontWeight: 500
                  })}>
                    {t('dashboard.search')} {searchQuery}
                  </Typography>
                )}
              </Box>
            )}
          </Box>

          {/* כותרת קטגוריה אם נבחרה */}
          {selectedCategory && (
            <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 1 }}>
              {t('dashboard.recipesInCategory')} {selectedCategory}
            </Typography>
          )}

          {/* אזור גלילה לכרטיסים */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1, minHeight: 0 }}>
            {isLoadingRecipes ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>{t('dashboard.loadingRecipes')}</Typography>
              </Box>
            ) : error ? (
              <Typography color="error" sx={{ textAlign: 'center', my: 3 }}>
                {t('common.error')}: {error}
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
                {t('dashboard.noRecipesFound')}
              </Typography>
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 3 }}>
                {t('dashboard.noRecipesYet')}
              </Typography>
            )}
          </Box>
        </Container>
      </Box>

      {/* מודלים */}
      <SearchDialog
        open={searchDialogOpen}
        onClose={() => setSearchDialogOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQueryDirect}
      />

      <CategoryDialog
        open={categoryDialogOpen}
        onClose={() => setCategoryDialogOpen(false)}
        onSelectCategory={handleSelectCategory}
      />

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