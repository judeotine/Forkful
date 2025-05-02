
// Storage keys
const FAVORITES_KEY = 'favorites';
const OFFLINE_RECIPES_KEY = 'offline_recipes';
const SEARCH_HISTORY_KEY = 'search_history';
const MEAL_PLAN_KEY = 'meal_plan';

// Types
export interface StoredRecipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes?: number;
  servings?: number;
}

export type SearchHistoryEntry = {
  id: string;
  query: string;
  timestamp: number;
  type: 'text' | 'ingredients';
  ingredients?: string[]; // Add ingredients array for ingredient-based searches
};

// Utility function to generate unique IDs
export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
};

// Favorites functionality
export const getFavorites = (): StoredRecipe[] => {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

export const addToFavorites = (recipe: StoredRecipe): void => {
  try {
    const favorites = getFavorites();
    const updatedFavorites = [...favorites, recipe];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error('Error adding to favorites:', error);
  }
};

export const removeFromFavorites = (recipeId: number): void => {
  try {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter(recipe => recipe.id !== recipeId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error('Error removing from favorites:', error);
  }
};

export const isInFavorites = (recipeId: number): boolean => {
  const favorites = getFavorites();
  return favorites.some(recipe => recipe.id === recipeId);
};

// Offline recipes functionality
export const saveRecipeOffline = (recipe: StoredRecipe): void => {
  try {
    const offlineRecipes = getOfflineRecipes();
    const updatedOfflineRecipes = [...offlineRecipes, recipe];
    localStorage.setItem(OFFLINE_RECIPES_KEY, JSON.stringify(updatedOfflineRecipes));
  } catch (error) {
    console.error('Error saving recipe offline:', error);
  }
};

export const getOfflineRecipes = (): StoredRecipe[] => {
  try {
    const offlineRecipes = localStorage.getItem(OFFLINE_RECIPES_KEY);
    return offlineRecipes ? JSON.parse(offlineRecipes) : [];
  } catch (error) {
    console.error('Error getting offline recipes:', error);
    return [];
  }
};

export const removeOfflineRecipe = (recipeId: number): void => {
  try {
    const offlineRecipes = getOfflineRecipes();
    const updatedOfflineRecipes = offlineRecipes.filter(recipe => recipe.id !== recipeId);
    localStorage.setItem(OFFLINE_RECIPES_KEY, JSON.stringify(updatedOfflineRecipes));
  } catch (error) {
    console.error('Error removing offline recipe:', error);
  }
};

export const isAvailableOffline = (recipeId: number): boolean => {
  const offlineRecipes = getOfflineRecipes();
  return offlineRecipes.some(recipe => recipe.id === recipeId);
};

// Search history functionality
export const addToSearchHistory = (
  queryOrIngredients: string | string[],
  type: 'text' | 'ingredients' = 'text'
): SearchHistoryEntry | null => {
  try {
    const history = getSearchHistory();
    
    // Create new entry
    const newEntry: SearchHistoryEntry = {
      id: generateId(),
      query: Array.isArray(queryOrIngredients) ? queryOrIngredients.join(', ') : queryOrIngredients,
      timestamp: Date.now(),
      type
    };
    
    // If ingredients type, store the ingredients array
    if (type === 'ingredients' && Array.isArray(queryOrIngredients)) {
      newEntry.ingredients = queryOrIngredients;
    }
    
    // Add to beginning of array (most recent first)
    // For text searches, filter out duplicates by query
    // For ingredient searches, more complex comparison would be needed, but simplified here
    const updatedHistory = [
      newEntry,
      ...history.filter(item => {
        if (type === 'text' && item.type === 'text') {
          return item.query !== newEntry.query;
        }
        return true; // Keep all others for now, could be refined
      })
    ].slice(0, 10); // Keep only 10 most recent
    
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
    return newEntry;
  } catch (error) {
    console.error('Error adding to search history:', error);
    return null;
  }
};

export const getSearchHistory = (): SearchHistoryEntry[] => {
  try {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error getting search history:', error);
    return [];
  }
};

export const clearSearchHistory = (): void => {
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing search history:', error);
  }
};

export const removeSearchHistoryEntry = (id: string): void => {
  try {
    const history = getSearchHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error removing search history entry:', error);
  }
};

// Meal plan functionality
export type MealPlan = Record<string, StoredRecipe | null>;

export const saveMealPlan = (mealPlan: MealPlan): void => {
  try {
    localStorage.setItem(MEAL_PLAN_KEY, JSON.stringify(mealPlan));
  } catch (error) {
    console.error('Error saving meal plan:', error);
  }
};

export const getMealPlan = (): MealPlan | null => {
  try {
    const mealPlan = localStorage.getItem(MEAL_PLAN_KEY);
    return mealPlan ? JSON.parse(mealPlan) : null;
  } catch (error) {
    console.error('Error getting meal plan:', error);
    return null;
  }
};

// Export types properly for TypeScript with isolatedModules
export type { Recipe } from '@/services/spoonacularApi';
