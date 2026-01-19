// client/src/hooks/useRecipeFilters.ts
import { useState, useCallback } from 'react';

export const useRecipeFilters = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSelectCategory = useCallback((category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
  }, []);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setSelectedCategory(null);
  }, []);

  const setSearchQueryDirect = useCallback((query: string) => {
    setSearchQuery(query);
    setSelectedCategory(null);
  }, []);

  const resetFilters = useCallback(() => {
    setSelectedCategory(null);
    setSearchQuery('');
  }, []);

  return {
    selectedCategory,
    searchQuery,
    handleSelectCategory,
    handleSearchChange,
    setSearchQueryDirect,
    resetFilters,
  };
};

