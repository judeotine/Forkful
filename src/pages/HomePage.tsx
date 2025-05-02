
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Heart, ChevronRight, Clock, Utensils } from "lucide-react";
import { Recipe, searchRecipes } from "@/services/spoonacularApi";
import { getFavorites } from "@/services/storageService";
import { useTheme } from "@/contexts/ThemeContext";
import RecipeCard from "@/components/RecipeCard";
import LoadingRecipes from "@/components/LoadingRecipes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [trendingRecipes, setTrendingRecipes] = useState<Recipe[]>([]);
  const [quickMeals, setQuickMeals] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // Load trending recipes
        const trendingData = await searchRecipes({
          sort: "popularity",
          sortDirection: "desc",
          number: 6,
          addRecipeInformation: true,
        });
        setTrendingRecipes(trendingData.results);
        
        // Load quick meals (under 30 minutes)
        const quickMealsData = await searchRecipes({
          maxReadyTime: 30,
          sort: "popularity",
          sortDirection: "desc",
          number: 6,
          addRecipeInformation: true,
        });
        setQuickMeals(quickMealsData.results);
        
        // Load favorites from storage
        const storedFavorites = getFavorites();
        setFavorites(storedFavorites);
      } catch (error) {
        console.error("Error loading homepage data:", error);
        toast.error("Failed to load recipes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  return (
    <div className="flex flex-col pb-4 overflow-y-auto">
      <motion.div 
        className="px-4 pt-6 pb-4 bg-gradient-to-b from-background to-muted/20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-2">
          <motion.h1 
            className="text-gradient text-3xl font-bold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Forkful
          </motion.h1>
          <motion.div
            whileHover={{ rotate: 15 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button 
              variant="outline" 
              size="icon"
              onClick={toggleTheme}
              className="rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/10 dark:border-white/5 shadow-sm"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </Button>
          </motion.div>
        </div>
        
        <motion.p 
          className="text-muted-foreground mt-1 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Discover delicious recipes made just for you
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-2 gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Card 
              className="p-4 hover:shadow cursor-pointer glass-card hover:-translate-y-1 transition-all border-forkful-200/50"
              onClick={() => navigate("/search")}
            >
              <div className="flex items-center mb-2">
                <div className="bg-gradient-to-br from-forkful-400 to-forkful-600 rounded-full p-2 mr-2 shadow-sm">
                  <Search size={18} className="text-white" />
                </div>
                <h3 className="font-semibold">Search</h3>
              </div>
              <p className="text-sm text-muted-foreground">Find any recipe</p>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card 
              className="p-4 hover:shadow cursor-pointer glass-card hover:-translate-y-1 transition-all border-culinary-200/50"
              onClick={() => navigate("/ingredient-search")}
            >
              <div className="flex items-center mb-2">
                <div className="bg-gradient-to-br from-culinary-400 to-culinary-600 rounded-full p-2 mr-2 shadow-sm">
                  <Utensils size={18} className="text-white" />
                </div>
                <h3 className="font-semibold">By Ingredients</h3>
              </div>
              <p className="text-sm text-muted-foreground">Use what you have</p>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
      
      <div className="px-4 mt-4">
        {favorites.length > 0 && (
          <motion.section 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold flex items-center">
                <Heart size={18} className="mr-2 text-rose-500" /> 
                Your Favorites
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-sm"
                onClick={() => navigate("/favorites")}
              >
                See all <ChevronRight size={16} />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {favorites.slice(0, 3).map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                >
                  <RecipeCard 
                    recipe={recipe}
                    variant="compact"
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
        
        <motion.section 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gradient">Trending Now</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-sm"
              onClick={() => navigate("/search", { state: { sort: "popularity" } })}
            >
              See all <ChevronRight size={16} />
            </Button>
          </div>
          
          {loading ? (
            <LoadingRecipes count={4} />
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {trendingRecipes.slice(0, 4).map((recipe, index) => (
                <motion.div 
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                >
                  <RecipeCard key={recipe.id} recipe={recipe} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
        
        <motion.section 
          className="mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold flex items-center">
              <Clock size={18} className="mr-2 text-culinary-500" /> 
              <span className="text-gradient-green">Quick Meals</span>
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-sm"
              onClick={() => navigate("/search", { state: { maxReadyTime: 30 } })}
            >
              See all <ChevronRight size={16} />
            </Button>
          </div>
          
          {loading ? (
            <LoadingRecipes count={4} />
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {quickMeals.slice(0, 4).map((recipe, index) => (
                <motion.div 
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.3 }}
                >
                  <RecipeCard key={recipe.id} recipe={recipe} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default HomePage;
