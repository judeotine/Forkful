
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-screen p-4 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-md">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ 
            repeat: Infinity, 
            repeatType: "reverse", 
            duration: 2,
            ease: "easeInOut"
          }}
        >
          <h1 className="text-7xl font-bold mb-4 text-gradient">404</h1>
        </motion.div>
        
        <h2 className="text-2xl font-medium mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or was removed.
        </p>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-forkful-500 to-forkful-600 hover:shadow-lg transition-all"
          >
            Return to Home
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NotFoundPage;
