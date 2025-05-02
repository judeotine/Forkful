
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Users, Heart, Share, ExternalLink } from "lucide-react";
import { Recipe, getRecipeById } from "@/services/spoonacularApi";
import { addToFavorites, removeFromFavorites, isInFavorites } from "@/services/storageService";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [favorite, setFavorite] = useState<boolean>(false);
  
  useEffect(() => {
    const loadRecipe = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const recipeId = parseInt(id);
        const recipeData = await getRecipeById(recipeId);
        setRecipe(recipeData);
        setFavorite(isInFavorites(recipeId));
      } catch (error) {
        console.error("Error loading recipe:", error);
        toast.error("Failed to load recipe details");
      } finally {
        setLoading(false);
      }
    };
    
    loadRecipe();
  }, [id]);
  
  const toggleFavorite = () => {
    if (!recipe) return;
    
    if (favorite) {
      removeFromFavorites(recipe.id);
      toast.success(`${recipe.title} removed from favorites`);
    } else {
      addToFavorites(recipe);
      toast.success(`${recipe.title} added to favorites`);
    }
    
    setFavorite(!favorite);
  };
  
  const handleShare = async () => {
    if (!recipe) return;
    
    try {
      // @ts-ignore - APP_BASE_URL is defined in Layout.tsx
      const shareUrl = `${window.APP_BASE_URL}/recipe/${recipe.id}`;
      
      if (navigator.share) {
        await navigator.share({
          title: recipe.title,
          text: `Check out this recipe: ${recipe.title}`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };
  
  if (loading) {
    return (
      <div className="p-4">
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <Skeleton className="h-8 w-3/4" />
        </div>
        <Skeleton className="w-full h-64 rounded-lg mb-4" />
        <Skeleton className="h-4 w-1/4 mb-2" />
        <Skeleton className="h-4 w-1/3 mb-6" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }
  
  if (!recipe) {
    return (
      <div className="p-4 text-center">
        <p>Recipe not found</p>
        <Button 
          onClick={() => navigate(-1)}
          variant="outline" 
          className="mt-4"
        >
          Go Back
        </Button>
      </div>
    );
  }
  
  return (
    <div className="h-full overflow-y-auto pb-6">
      <div className="relative">
        <div className="absolute top-0 left-0 w-full p-4 flex items-center justify-between z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full bg-background/70 backdrop-blur-sm"
          >
            <ArrowLeft size={20} />
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="rounded-full bg-background/70 backdrop-blur-sm"
            >
              <Share size={18} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFavorite}
              className="rounded-full bg-background/70 backdrop-blur-sm"
            >
              <Heart size={18} className={favorite ? "fill-red-500 text-red-500" : ""} />
            </Button>
          </div>
        </div>
        
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full object-cover h-64 sm:h-80"
        />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      
      <div className="px-4 -mt-12 relative z-10">
        <div className="glass-card p-4">
          <h1 className="text-2xl font-semibold mb-2">{recipe.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {recipe.diets?.map((diet) => (
              <span
                key={diet}
                className="px-2 py-1 bg-culinary-100 text-culinary-800 dark:bg-culinary-900 dark:text-culinary-200 text-xs rounded-full"
              >
                {diet}
              </span>
            ))}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center">
              <Clock size={16} className="mr-1" />
              <span>{recipe.readyInMinutes} min</span>
            </div>
            
            <div className="flex items-center">
              <Users size={16} className="mr-1" />
              <span>{recipe.servings} servings</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-4 mt-4">
        <Tabs defaultValue="ingredients">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ingredients" className="mt-4">
            <h2 className="text-lg font-medium mb-3">Ingredients:</h2>
            <ul className="space-y-2 pl-1">
              {recipe.extendedIngredients?.map((ingredient, index) => (
                <li key={index} className="flex items-center py-2 border-b border-border/50 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-forkful-400 mr-3"></div>
                  <span>
                    {ingredient.amount} {ingredient.unit} {ingredient.name}
                  </span>
                </li>
              )) || (
                <li className="text-muted-foreground">No ingredient information available</li>
              )}
            </ul>
          </TabsContent>
          
          <TabsContent value="instructions" className="mt-4">
            <h2 className="text-lg font-medium mb-3">Instructions:</h2>
            
            {recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0 ? (
              <ol className="space-y-4 pl-4">
                {recipe.analyzedInstructions[0].steps.map((step) => (
                  <li key={step.number} className="mb-4">
                    <div className="flex items-start">
                      <span className="bg-forkful-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                        {step.number}
                      </span>
                      <p>{step.step}</p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : recipe.instructions ? (
              <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
            ) : (
              <p className="text-muted-foreground">No instructions available</p>
            )}
          </TabsContent>
          
          <TabsContent value="nutrition" className="mt-4">
            <h2 className="text-lg font-medium mb-3">Nutrition Facts:</h2>
            
            {recipe.nutrition && recipe.nutrition.nutrients ? (
              <div className="space-y-2">
                {recipe.nutrition.nutrients.slice(0, 8).map((nutrient) => (
                  <div
                    key={nutrient.name}
                    className="flex justify-between py-2 border-b border-border/50 last:border-0"
                  >
                    <span>{nutrient.name}</span>
                    <span>
                      {nutrient.amount} {nutrient.unit}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No nutrition information available</p>
            )}
          </TabsContent>
        </Tabs>
        
        {recipe.sourceUrl && (
          <div className="mt-6 pt-4 border-t border-border/50">
            <a
              href={recipe.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-forkful-600 dark:text-forkful-400 hover:underline"
            >
              <span className="mr-1">View original recipe</span>
              <ExternalLink size={14} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetailPage;
