
import { useState, useEffect } from "react";

const STORAGE_KEY = "forkful-onboarding-completed";

export const useOnboarding = () => {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Check if onboarding has been completed before
    const hasCompletedOnboarding = localStorage.getItem(STORAGE_KEY) === "true";
    
    // Set state based on local storage
    setShowOnboarding(!hasCompletedOnboarding);
  }, []);
  
  const completeOnboarding = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setShowOnboarding(false);
  };

  const resetOnboarding = () => {
    localStorage.removeItem(STORAGE_KEY);
    setShowOnboarding(true);
  };
  
  return { 
    showOnboarding,
    completeOnboarding,
    resetOnboarding
  };
};
