
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import BottomNavigation from "./BottomNavigation";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { AlertCircle, WifiOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Layout: React.FC = () => {
  const location = useLocation();
  const { isOnline } = useNetworkStatus();
  const isDetailPage = location.pathname.includes('/recipe/');
  
  // Get the current domain without the lovableproject.com part for sharing
  const getCleanDomain = () => {
    const url = window.location.origin;
    return url.replace(".lovableproject.com", "");
  };

  // Set up a global variable that can be used for sharing
  React.useEffect(() => {
    // @ts-ignore - Set a global for sharing purposes
    window.APP_BASE_URL = getCleanDomain();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-accent/20 dark:from-gray-900 dark:to-gray-800">
      {!isOnline && (
        <Alert variant="destructive" className="fixed top-2 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-md flex items-center shadow-lg bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/50 dark:border-amber-700 dark:text-amber-200">
          <WifiOff className="h-4 w-4 mr-2" />
          <AlertDescription className="text-sm font-medium">
            You're offline. Some features may be limited.
          </AlertDescription>
        </Alert>
      )}
      
      <AnimatePresence mode="wait">
        <motion.main 
          key={location.pathname}
          className={cn(
            "flex-1 flex flex-col overflow-hidden",
            isDetailPage ? "pb-0" : "pb-16" // Padding at bottom to account for navigation
          )}
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -15 }}
          transition={{ 
            type: "spring",
            stiffness: 260, 
            damping: 20, 
            duration: 0.3 
          }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      
      {!isDetailPage && <BottomNavigation />}
    </div>
  );
};

export default Layout;
