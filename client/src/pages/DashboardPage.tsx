// client/src/pages/DashboardPage.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  Divider,
  Button,
  CircularProgress,
  TextField,
  Tabs, // ייבוא Tabs
  Tab // ייבוא Tab
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';

import AppHeader from '../components/AppHeader';
import AddRecipeModal from '../components/AddRecipeModal';
import ViewRecipeModal from '../components/ViewRecipeModal';
import RecipeList from '../components/RecipeList';
import AppFooter from '../components/AppFooter';
import CategoryGrid from '../components/CategoryGrid';
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'recipes' | 'categories'>('recipes'); // מצב חדש ללשוניות

  const fetchRecipes = useCallback(async (category?: string, query?: string) => {
    setIsLoadingRecipes(true);
    setError(null);
    try {
      let url = '/recipes';
      const params = new URLSearchParams();
      if (category) {
        params.append('category', category);
      }
      if (query) {
        params.append('search', query);
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      const response = await apiClient.get(url);
      setRecipes(response.data);
    } catch (err: any) {
      console.error('Error fetching recipes:', err);
      setError(err.response?.data?.message || 'אירעה שגיאה בטעינת המתכונים.');
    } finally {
      setIsLoadingRecipes(false);
    }
  }, []);

  useEffect(() => {
    fetchRecipes(selectedCategory || undefined, searchQuery);
  }, [fetchRecipes, selectedCategory, searchQuery]);

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
      fetchRecipes(selectedCategory || undefined, searchQuery);
    } catch (err: any) {
      console.error('Error creating recipe:', err);
      alert(err.response?.data?.message || 'אירעה שגיאה ביצירת המתכון.');
    }
  }, [fetchRecipes, selectedCategory, searchQuery]);

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
      fetchRecipes(selectedCategory || undefined, searchQuery);
    } catch (err: any) {
      console.error('Error updating recipe:', err);
      alert(err.response?.data?.message || 'אירעה שגיאה בעדכון המתכון.');
    }
  }, [fetchRecipes, selectedCategory, searchQuery]);

  const handleCloseEditRecipeModal = () => {
    setOpenEditRecipeModal(false);
    setSelectedRecipe(null);
  };

  const handleDeleteRecipe = useCallback(async (id: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק מתכון זה?')) {
      try {
        await apiClient.delete(`/recipes/${id}`);
        alert('מתכון נמחק בהצלחה!');
        fetchRecipes(selectedCategory || undefined, searchQuery);
      } catch (err: any) {
        console.error('Error deleting recipe:', err);
        alert(err.response?.data?.message || 'אירעה שגיאה במחיקת המתכון.');
      }
    }
  }, [fetchRecipes, selectedCategory, searchQuery]);

  const handleSelectCategory = useCallback((category: string) => {
    setSelectedCategory(category);
    setSearchQuery(''); // איפוס חיפוש בבחירת קטגוריה חדשה
    setActiveTab('recipes'); // מעבר אוטומטי ללשונית המתכונים לאחר בחירת קטגוריה
  }, []);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setSelectedCategory(null); // איפוס קטגוריה בחיפוש
    setActiveTab('recipes'); // מעבר אוטומטי ללשונית המתכונים בזמן חיפוש
  }, []);

  // הלוגיקה של showCategoryGrid ו-showRecipeList כבר לא משמשת את הרינדור הראשי,
  // אך נשאירה לצורך בהירות אם תרצה להשתמש בה עבור תנאים פנימיים בתוך הלשוניות.
  const showCategoryGridLogic = !selectedCategory && !searchQuery && recipes.length === 0 && !isLoadingRecipes && !error;
  const showRecipeListLogic = (selectedCategory || searchQuery || recipes.length > 0) && !isLoadingRecipes && !error;


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
            onClick={handleOpenAddRecipeModal}
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
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
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