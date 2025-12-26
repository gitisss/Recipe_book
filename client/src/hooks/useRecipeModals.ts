// client/src/hooks/useRecipeModals.ts
import { useState, useCallback } from 'react';
import type { IRecipe } from '../types/Recipe';

export const useRecipeModals = () => {
  const [openAddRecipeModal, setOpenAddRecipeModal] = useState<boolean>(false);
  const [openViewRecipeModal, setOpenViewRecipeModal] = useState<boolean>(false);
  const [openEditRecipeModal, setOpenEditRecipeModal] = useState<boolean>(false);
  const [selectedRecipe, setSelectedRecipe] = useState<IRecipe | null>(null);

  const handleOpenAddRecipeModal = useCallback(() => {
    setOpenAddRecipeModal(true);
  }, []);

  const handleCloseAddRecipeModal = useCallback(() => {
    setOpenAddRecipeModal(false);
  }, []);

  const handleViewRecipe = useCallback((recipe: IRecipe) => {
    setSelectedRecipe(recipe);
    setOpenViewRecipeModal(true);
  }, []);

  const handleCloseViewRecipeModal = useCallback(() => {
    setOpenViewRecipeModal(false);
    setSelectedRecipe(null);
  }, []);

  const handleEditRecipe = useCallback((recipe: IRecipe) => {
    setSelectedRecipe(recipe);
    setOpenEditRecipeModal(true);
  }, []);

  const handleCloseEditRecipeModal = useCallback(() => {
    setOpenEditRecipeModal(false);
    setSelectedRecipe(null);
  }, []);

  return {
    openAddRecipeModal,
    openViewRecipeModal,
    openEditRecipeModal,
    selectedRecipe,
    handleOpenAddRecipeModal,
    handleCloseAddRecipeModal,
    handleViewRecipe,
    handleCloseViewRecipeModal,
    handleEditRecipe,
    handleCloseEditRecipeModal,
    setSelectedRecipe,
  };
};

