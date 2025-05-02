
import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { getFavorites } from "@/services/storageService";
import { Recipe } from "@/services/spoonacularApi";
import RecipeCard from "@/components/RecipeCard";

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  
  // Load favorites when component mounts
  useEffect(() => {
    loadFavorites();
    
    // Set up an event listener for storage changes (in case user adds/removes favorites in another tab)
    const handleStorageChange = () => {
      loadFavorites();
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  
  // Refresh favorites when user returns to page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadFavorites();
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  
  const loadFavorites = () => {
    const storedFavorites = getFavorites();
    setFavorites(storedFavorites);
  };
  
  return (
    <div className="p-4 h-full overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6">Favorites</h1>
      
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <Heart size={48} className="text-muted-foreground mb-4 opacity-20" />
          <h2 className="text-xl font-medium mb-2">No favorites yet</h2>
          <p className="text-muted-foreground">
            Save your favorite recipes by tapping the heart icon
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {favorites.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
