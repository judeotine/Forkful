
import React from "react";
import { Recipe } from "@/services/spoonacularApi";
import { Link } from "react-router-dom";
import { Clock, Heart, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";
import { isInFavorites, addToFavorites, removeFromFavorites, isAvailableOffline } from "@/services/storageService";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";

interface RecipeCardProps {
  recipe: Recipe;
  variant?: "default" | "compact";
  className?: string;
  onClick?: () => void;
  draggable?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  variant = "default",
  className,
  onClick,
  draggable = false
}) => {
  const [favorite, setFavorite] = React.useState<boolean>(isInFavorites(recipe.id));
  const [isOffline, setIsOffline] = React.useState<boolean>(isAvailableOffline(recipe.id));
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Stop event propagation
    
    if (favorite) {
      removeFromFavorites(recipe.id);
      toast.success(`${recipe.title} removed from favorites`);
    } else {
      addToFavorites(recipe);
      toast.success(`${recipe.title} added to favorites`);
    }
    
    setFavorite(!favorite);
  };

  const isCompact = variant === "compact";
  
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={cn(
        "glass-panel group relative overflow-hidden rounded-xl",
        isCompact ? "flex flex-row h-24" : "flex flex-col h-full",
        onClick ? "cursor-pointer" : "",
        className
      )}
      draggable={draggable}
    >
      <Link 
        to={`/recipe/${recipe.id}`} 
        className="w-full h-full flex"
        onClick={handleClick}
      >
        <div 
          className={cn(
            "relative overflow-hidden",
            isCompact ? "w-24 h-24" : "w-full pt-[70%]"
          )}
        >
          <img
            src={recipe.image}
            alt={recipe.title}
            className={cn(
              "object-cover transition-transform duration-500 group-hover:scale-110",
              isCompact ? "w-full h-full" : "absolute inset-0 w-full h-full"
            )}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <motion.button
            onClick={toggleFavorite}
            whileTap={{ scale: 0.9 }}
            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full p-1.5 transition-all hover:bg-background"
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            {favorite ? (
              <Heart size={16} className="text-primary fill-primary" />
            ) : (
              <Heart size={16} className="text-muted-foreground" />
            )}
          </motion.button>
          
          {isOffline && (
            <Badge 
              variant="outline" 
              className="absolute bottom-2 left-2 bg-background/70 backdrop-blur-sm text-xs py-0.5 px-1.5 flex items-center gap-1"
            >
              <Wifi size={10} /> Offline
            </Badge>
          )}
        </div>
        
        <div className={cn(
          "flex flex-col p-3", 
          isCompact ? "flex-1 justify-center" : ""
        )}>
          <h3 className={cn(
            "font-medium line-clamp-2 mb-1 group-hover:text-primary transition-colors",
            isCompact ? "text-sm" : "text-base"
          )}>
            {recipe.title}
          </h3>
          
          {!isCompact && (
            <>
              {(recipe.diets && recipe.diets.length > 0) && (
                <div className="flex flex-wrap gap-1 mt-1 mb-2">
                  {recipe.diets.slice(0, 2).map(diet => (
                    <Badge 
                      key={diet} 
                      variant="secondary"
                      className="text-xs bg-culinary-100 text-culinary-800 dark:bg-culinary-900 dark:text-culinary-200"
                    >
                      {diet}
                    </Badge>
                  ))}
                  {recipe.diets.length > 2 && (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Badge className="text-xs cursor-help">
                          +{recipe.diets.length - 2}
                        </Badge>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-64">
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">All Diets</h4>
                          <div className="flex flex-wrap gap-1">
                            {recipe.diets.map(diet => (
                              <Badge 
                                key={diet} 
                                variant="secondary" 
                                className="text-xs"
                              >
                                {diet}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  )}
                </div>
              )}

              <div className="flex items-center text-muted-foreground text-sm mt-auto">
                <Clock size={14} className="mr-1" />
                <span>{recipe.readyInMinutes || "30"} min</span>
              </div>
            </>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default RecipeCard;
