
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Book, Utensils, Search, Heart, ChefHat, Frown, ArrowUpDown, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OnboardingScreenProps {
  onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      title: "Welcome to Forkful",
      description: "Your personal recipe assistant. Find, save, and cook delicious meals with ease.",
      icon: <Utensils size={40} className="text-forkful-500" />,
      image: "cooking.svg"
    },
    {
      title: "Discover Recipes",
      description: "Search by ingredients, cuisine, or dietary needs and find the perfect meal for any occasion.",
      icon: <Search size={40} className="text-forkful-500" />,
      image: "search.svg"
    },
    {
      title: "Save Your Favorites",
      description: "Build your personal cookbook with recipes you love and access them anytime, even offline.",
      icon: <Heart size={40} className="text-forkful-500" />,
      image: "favorites.svg"
    },
    {
      title: "Meal Planning Made Simple",
      description: "Plan your meals for the week ahead and generate shopping lists automatically.",
      icon: <Book size={40} className="text-forkful-500" />,
      image: "planning.svg"
    },
    {
      title: "Cook with Confidence",
      description: "Follow step-by-step instructions and use timers to cook like a pro.",
      icon: <ChefHat size={40} className="text-forkful-500" />,
      image: "cooking.svg"
    }
  ];
  
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const skipAll = () => {
    onComplete();
  };
  
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-forkful-50 to-forkful-100 flex flex-col items-center justify-between p-6 z-50">
      <div className="w-full flex justify-end">
        <button 
          onClick={skipAll}
          className="text-sm text-forkful-700 hover:text-forkful-800 transition-colors"
        >
          Skip
        </button>
      </div>
      
      <div className="flex items-center justify-center flex-1 w-full max-w-md mx-auto">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center text-center w-full"
        >
          <div className="mb-6 text-center">
            {steps[currentStep].icon}
          </div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="text-2xl font-bold text-gray-800 mb-4"
          >
            {steps[currentStep].title}
          </motion.div>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="text-gray-600 mb-8"
          >
            {steps[currentStep].description}
          </motion.p>
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
            className="w-60 h-60 flex items-center justify-center rounded-full bg-white/50 shadow-lg mb-8"
          >
            {/* Placeholder for illustration */}
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-forkful-200 to-forkful-400 flex items-center justify-center text-white">
              {/* Replace with actual image or icon */}
              {steps[currentStep].icon}
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full mx-1 ${
                index === currentStep ? "bg-forkful-500" : "bg-forkful-200"
              }`}
            />
          ))}
        </div>
        
        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex-1 bg-white/80"
          >
            Back
          </Button>
          <Button onClick={nextStep} className="flex-1 bg-forkful-500 hover:bg-forkful-600">
            {currentStep === steps.length - 1 ? "Get Started" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;
