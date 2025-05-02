
import React, { useState, useEffect } from "react";
import { Calendar, Utensils, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getFavorites, StoredRecipe, saveMealPlan, getMealPlan } from "@/services/storageService";
import RecipeCard from "@/components/RecipeCard";
import { useNavigate } from "react-router-dom";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const MealPlannerPage: React.FC = () => {
  const [favorites, setFavorites] = useState<StoredRecipe[]>([]);
  const [mealPlan, setMealPlan] = useState<Record<string, StoredRecipe | null>>({});
  const [currentDay, setCurrentDay] = useState<string>(DAYS_OF_WEEK[0]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  
  // Load favorites and meal plan from storage
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Load favorites
        const storedFavorites = getFavorites();
        setFavorites(storedFavorites);
        
        // Load meal plan
        const storedMealPlan = getMealPlan();
        if (storedMealPlan) {
          setMealPlan(storedMealPlan);
        } else {
          // Initialize empty meal plan if none exists
          const initialMealPlan: Record<string, StoredRecipe | null> = {};
          DAYS_OF_WEEK.forEach(day => {
            initialMealPlan[day] = null;
          });
          setMealPlan(initialMealPlan);
          saveMealPlan(initialMealPlan);
        }
      } catch (error) {
        console.error("Error loading meal plan data:", error);
        toast.error("Failed to load meal plan");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Save meal plan to local storage whenever it changes
  useEffect(() => {
    if (Object.keys(mealPlan).length > 0) {
      saveMealPlan(mealPlan);
    }
  }, [mealPlan]);
  
  // Add recipe to current day's meal plan
  const addToMealPlan = (recipe: StoredRecipe) => {
    setMealPlan(prev => {
      const updated = { ...prev, [currentDay]: recipe };
      saveMealPlan(updated);
      return updated;
    });
    toast.success(`Added ${recipe.title} to ${currentDay}`);
  };
  
  // Remove recipe from current day's meal plan
  const removeFromMealPlan = () => {
    setMealPlan(prev => {
      const updated = { ...prev, [currentDay]: null };
      saveMealPlan(updated);
      return updated;
    });
    toast.success(`Removed recipe from ${currentDay}`);
  };

  // Navigate to search page to add more favorites
  const goToSearch = () => {
    navigate('/search');
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-4">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-muted-foreground">Loading your meal plan...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 h-full overflow-y-auto pb-20">
      <div className="flex items-center mb-6">
        <Calendar className="mr-2 text-primary" size={24} />
        <h1 className="text-2xl font-bold">Weekly Meal Planner</h1>
      </div>
      
      <Tabs value={currentDay} onValueChange={setCurrentDay} className="space-y-4">
        <TabsList className="flex overflow-x-auto pb-2 mb-2 no-scrollbar">
          {DAYS_OF_WEEK.map(day => (
            <TabsTrigger 
              key={day} 
              value={day}
              className="flex-shrink-0 relative"
            >
              {day}
              {mealPlan[day] && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {DAYS_OF_WEEK.map(day => (
          <TabsContent key={day} value={day} className="space-y-4">
            <Card className="bg-card/70 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span>{day}'s Meal</span>
                  {mealPlan[day] && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={removeFromMealPlan}
                      className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:border-red-800/30"
                    >
                      Remove
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mealPlan[day] ? (
                  <div className="flex flex-col">
                    <RecipeCard recipe={mealPlan[day]!} variant="compact" />
                  </div>
                ) : (
                  <div className="bg-muted/50 rounded-lg p-6 text-center">
                    <Utensils className="mx-auto mb-3 text-muted-foreground" size={32} />
                    <p className="text-muted-foreground">No meal planned for {day}</p>
                    <p className="text-sm text-muted-foreground mt-1">Pick a recipe from your favorites below</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <h3 className="text-lg font-medium mt-6 mb-3">Add from your favorites</h3>
            
            {favorites.length === 0 ? (
              <Card className="bg-card/70 backdrop-blur-sm border-border/50 p-6 text-center">
                <p className="text-muted-foreground">No favorites yet</p>
                <Button variant="link" className="mt-2" onClick={goToSearch}>Go to search</Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {favorites.map(recipe => (
                  <motion.div 
                    key={recipe.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => addToMealPlan(recipe)}
                    className="cursor-pointer"
                  >
                    <RecipeCard recipe={recipe} variant="compact" />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default MealPlannerPage;
