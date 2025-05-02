
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Recipe, searchRecipes, Diet, Intolerance } from "@/services/spoonacularApi";
import RecipeCard from "@/components/RecipeCard";
import LoadingRecipes from "@/components/LoadingRecipes";
import DietFilters from "@/components/DietFilters";
import { toast } from "sonner";
import { addToSearchHistory } from "@/services/storageService";

interface SearchPageProps {}

const SearchPage: React.FC<SearchPageProps> = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState<boolean>(false);
  
  // Diet filters with proper typing
  const [selectedDiet, setSelectedDiet] = useState<Diet | null>(null);
  const [selectedIntolerances, setSelectedIntolerances] = useState<Intolerance[]>([]);
  
  // Initial state from navigation params
  useEffect(() => {
    const state = location.state as any;
    if (state) {
      // Handle initial search params from navigation
      if (state.sort === "popularity") {
        handlePopularSearch();
      } else if (state.maxReadyTime) {
        handleQuickMealsSearch(state.maxReadyTime);
      }
    }
  }, [location.state]);
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    
    setLoading(true);
    
    try {
      // Save search to history
      addToSearchHistory(searchQuery, 'text');
      
      const result = await searchRecipes({
        query: searchQuery,
        number: 24,
        diet: selectedDiet || undefined,
        intolerances: selectedIntolerances.length > 0 ? selectedIntolerances.join(',') : undefined,
        addRecipeInformation: true,
      });
      
      setRecipes(result.results);
      
      if (result.results.length === 0) {
        toast.info("No recipes found. Try different search terms.");
      }
    } catch (error) {
      console.error("Error searching recipes:", error);
      toast.error("Failed to search recipes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };
  
  // Handle searching for popular recipes
  const handlePopularSearch = async () => {
    setLoading(true);
    
    try {
      const result = await searchRecipes({
        sort: "popularity",
        sortDirection: "desc",
        number: 24,
        addRecipeInformation: true,
      });
      
      setRecipes(result.results);
    } catch (error) {
      console.error("Error searching popular recipes:", error);
      toast.error("Failed to load popular recipes");
    } finally {
      setLoading(false);
    }
  };
  
  // Handle searching for quick meals
  const handleQuickMealsSearch = async (maxTime: number = 30) => {
    setLoading(true);
    
    try {
      const result = await searchRecipes({
        maxReadyTime: maxTime,
        sort: "popularity",
        sortDirection: "desc",
        number: 24,
        addRecipeInformation: true,
      });
      
      setRecipes(result.results);
    } catch (error) {
      console.error("Error searching quick meals:", error);
      toast.error("Failed to load quick meals");
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = () => {
    setFilterDialogOpen(false);
    handleSearch();
  };
  
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="sticky top-0 z-10 bg-background pt-4 pb-4 px-4 shadow-sm">
        <div className="flex gap-2 mb-2">
          <div className="relative flex-1">
            <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9"
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
          </div>
          <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal size={18} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <div className="pt-2">
                <h2 className="text-lg font-semibold mb-4">Filter Recipes</h2>
                <DietFilters
                  selectedDiet={selectedDiet}
                  setSelectedDiet={setSelectedDiet}
                  selectedIntolerances={selectedIntolerances}
                  setSelectedIntolerances={setSelectedIntolerances}
                />
                <Button 
                  className="w-full mt-6" 
                  onClick={handleFilterChange}
                >
                  Apply Filters
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={handleSearch}>
            Search
          </Button>
        </div>
      </div>
      
      <div className="flex-1 p-4">
        {loading ? (
          <LoadingRecipes />
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <SearchIcon size={48} className="text-muted-foreground mb-4 opacity-20" />
            <h2 className="text-xl font-medium mb-2">Find amazing recipes</h2>
            <p className="text-muted-foreground max-w-sm">
              Search for recipes by name, ingredient, or cuisine
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
