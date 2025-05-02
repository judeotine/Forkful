
import React from "react";
import { motion } from "framer-motion";

interface LoadingRecipesProps {
  count?: number;
  variant?: "default" | "compact";
}

const LoadingRecipes: React.FC<LoadingRecipesProps> = ({ 
  count = 4,
  variant = "default"
}) => {
  const isCompact = variant === "compact";
  
  const items = Array.from({ length: count }, (_, i) => i);
  
  // Animation variants for staggered loading animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  
  return (
    <motion.div 
      className={`grid ${isCompact ? "grid-cols-1" : "grid-cols-2"} gap-4`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((item) => (
        <motion.div
          key={item}
          variants={itemVariants}
          className={`overflow-hidden rounded-xl glass-panel ${
            isCompact 
              ? "flex flex-row h-24" 
              : "flex flex-col h-full"
          }`}
        >
          <div 
            className={`relative ${
              isCompact ? "w-24 h-24" : "w-full pt-[70%]"
            }`}
          >
            <div className="loading-skeleton absolute inset-0">
              <div className="absolute inset-0 animate-shine"></div>
            </div>
          </div>
          
          <div className={`flex flex-col p-3 ${isCompact ? "flex-1" : ""}`}>
            <div className="loading-skeleton h-4 w-3/4 mb-2"></div>
            <div className="loading-skeleton h-4 w-1/2"></div>
            
            {!isCompact && (
              <>
                <div className="flex mt-2 mb-2 gap-1">
                  <div className="loading-skeleton h-5 w-16 rounded-full"></div>
                  <div className="loading-skeleton h-5 w-16 rounded-full"></div>
                </div>
                <div className="loading-skeleton h-4 w-12 mt-auto"></div>
              </>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default LoadingRecipes;
