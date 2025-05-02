
import React, { useState, useEffect } from "react";
import { Search as SearchIcon, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Recipe, searchRecipesByIngredients, Diet, Intolerance } from "@/services/spoonacularApi";
import { addToSearchHistory, getSearchHistory, SearchHistoryEntry } from "@/services/storageService";
import RecipeCard from "@/components/RecipeCard";
import LoadingRecipes from "@/components/LoadingRecipes";
import DietFilters from "@/components/DietFilters";
import IngredientTag from "@/components/IngredientTag";
import { toast } from "sonner";

const IngredientSearchPage: React.FC = () => {
  const [ingredientInput, setIngredientInput] = useState<string>("");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searching, setSearching] = useState<boolean>(false);
  
  // Filter states
  const [selectedDiet, setSelectedDiet] = useState<Diet | null>(null);
  const [selectedIntolerances, setSelectedIntolerances] = useState<Intolerance[]>([]);
  const [filterDialogOpen, setFilterDialogOpen] = useState<boolean>(false);
  
  const handleAddIngredient = () => {
    if (ingredientInput.trim() && !selectedIngredients.includes(ingredientInput.trim())) {
      setSelectedIngredients([...selectedIngredients, ingredientInput.trim()]);
      setIngredientInput("");
    }
  };
  
  const handleRemoveIngredient = (ingredient: string) => {
    setSelectedIngredients(selectedIngredients.filter(item => item !== ingredient));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
  };
  
  const handleSearch = async () => {
    if (selectedIngredients.length === 0) {
      toast.error("Please add at least one ingredient");
      return;
    }
    
    setSearching(true);
    setLoading(true);
    
    try {
      // Save to search history with ingredients type
      addToSearchHistory(selectedIngredients, 'ingredients');
      loadSearchHistory();
      
      const result = await searchRecipesByIngredients(selectedIngredients, {
        number: 12,
        ranking: 1, // maximize used ingredients
        ignorePantry: true,
      });
      
      setRecipes(result);
    } catch (error) {
      console.error("Error searching recipes by ingredients:", error);
      toast.error("Failed to search recipes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleHistorySearch = (entry: SearchHistoryEntry) => {
    // Handle ingredient-based searches
    const ingredientsList = entry.ingredients || entry.query.split(', ');
    setSelectedIngredients(Array.isArray(ingredientsList) ? ingredientsList : [ingredientsList]);
    
    // Trigger search with these ingredients
    setSearching(true);
    setLoading(true);
    
    searchRecipesByIngredients(Array.isArray(ingredientsList) ? ingredientsList : [ingredientsList], {
      number: 12,
      ranking: 1, // maximize used ingredients
      ignorePantry: true,
    })
      .then(result => {
        setRecipes(result);
      })
      .catch(error => {
        console.error("Error searching recipes by ingredients:", error);
        toast.error("Failed to search recipes. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  const loadSearchHistory = () => {
    const history = getSearchHistory();
    // Filter to only show ingredient searches
    setSearchHistory(history.filter(entry => entry.type === 'ingredients'));
  };
  
  const handleFilterChange = () => {
    setFilterDialogOpen(false);
    // In a real app, you would apply these filters in the API call
    // For this example, we'll just acknowledge that filters would be applied
    if (selectedDiet || selectedIntolerances.length > 0) {
      toast.info("Filters would be applied in a complete implementation");
    }
  };
  
  useEffect(() => {
    loadSearchHistory();
  }, []);
  
  const hasFilters = selectedDiet || selectedIntolerances.length > 0;
  
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="sticky top-0 z-10 bg-background pt-4 pb-2 px-4 shadow-sm">
        <div className="flex gap-2 mb-3">
          <Input
            type="text"
            placeholder="Add ingredient..."
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
            className="flex-1"
            autoComplete="off"
            onKeyDown={handleKeyDown}
          />
          <Button onClick={handleAddIngredient} className="flex-shrink-0">
            <Plus size={18} />
          </Button>
          <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant={hasFilters ? "default" : "outline"} 
                size="icon"
                className="flex-shrink-0"
              >
                <SearchIcon size={18} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <div className="pt-2">
                <h2 className="text-lg font-semibold mb-4">Filter Recipes</h2>
                <DietFilters
                  selectedDiet={selectedDiet}
                  setSelectedDiet={setSelectedDiet as React.Dispatch<React.SetStateAction<string | null>>}
                  selectedIntolerances={selectedIntolerances}
                  setSelectedIntolerances={setSelectedIntolerances as React.Dispatch<React.SetStateAction<string[]>>}
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
        </div>
        
        {selectedIngredients.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedIngredients.map((ingredient, index) => (
              <IngredientTag
                key={`${ingredient}-${index}`}
                ingredient={ingredient}
                onRemove={handleRemoveIngredient}
              />
            ))}
          </div>
        )}
        
        <Button 
          onClick={handleSearch} 
          className="w-full"
          disabled={selectedIngredients.length === 0 || loading}
        >
          Find Recipes
        </Button>
      </div>
      
      <div className="flex-1 p-4">
        {!searching && searchHistory.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Recent Searches</h2>
            <div className="flex flex-col space-y-3">
              {searchHistory.slice(0, 5).map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => handleHistorySearch(entry)}
                  className="flex flex-wrap items-center gap-2 px-3 py-2 hover:bg-muted rounded-md transition-colors text-left"
                >
                  {(entry.ingredients || entry.query.split(', ')).map((ingredient, idx) => (
                    <IngredientTag
                      key={`hist-${entry.id}-${idx}`}
                      ingredient={ingredient}
                      readOnly
                      className="bg-muted"
                    />
                  ))}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {searching && (
          <div>
            <h2 className="text-lg font-medium mb-4">
              {recipes.length > 0 
                ? `${recipes.length} recipes found` 
                : loading ? "Searching..." : "No recipes found"}
            </h2>
            
            {loading ? (
              <LoadingRecipes />
            ) : recipes.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : !loading && (
              <div className="text-center my-12">
                <p className="text-muted-foreground">
                  No recipes found with these ingredients. Try adding more or different ingredients.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IngredientSearchPage;
