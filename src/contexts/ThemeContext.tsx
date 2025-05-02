
import React, { createContext, useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "forkful-theme";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  // Initialize theme based on device preference or stored value
  const [theme, setTheme] = useState<Theme>(() => {
    // Check for stored preference
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      return savedTheme;
    }
    
    // Check for device preference
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches 
        ? "dark" 
        : "light";
    }
    
    return "light"; // Default
  });
  
  // Theme transition animation state
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Toggle theme function
  const toggleTheme = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setTheme(prevTheme => {
        const newTheme = prevTheme === "light" ? "dark" : "light";
        localStorage.setItem(STORAGE_KEY, newTheme);
        return newTheme;
      });
      setTimeout(() => setIsTransitioning(false), 300);
    }, 100);
  };
  
  // Apply theme class to document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove both classes to handle any inconsistencies
    root.classList.remove("light", "dark");
    
    // Add the current theme class
    root.classList.add(theme);
  }, [theme]);
  
  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      // Only apply system changes if user hasn't manually set a preference
      if (!localStorage.getItem(STORAGE_KEY)) {
        setTheme(mediaQuery.matches ? "dark" : "light");
      }
    };
    
    // Modern browsers
    mediaQuery.addEventListener("change", handleChange);
    
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key="theme-transition-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-background dark:bg-gray-900 z-[9999]"
          />
        )}
      </AnimatePresence>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
