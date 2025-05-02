import React, { Suspense, lazy, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { initializePushNotifications, setupNotificationListeners } from "./services/notificationService";

// Pages
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import IngredientSearchPage from "./pages/IngredientSearchPage";
import FavoritesPage from "./pages/FavoritesPage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import NotFoundPage from "./pages/NotFoundPage";
import Layout from "./components/Layout";
import OnboardingScreen from "./components/Onboarding";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSkeletonCard from "./components/LoadingSkeletonCard";

// UI Components
import { TooltipProvider } from "@/components/ui/tooltip";
import { useOnboarding } from "./hooks/useOnboarding";

// Lazy loaded components
const MealPlannerPage = lazy(() => import("./pages/MealPlannerPage"));
const ShoppingListPage = lazy(() => import("./pages/ShoppingListPage"));
const CollectionsPage = lazy(() => import("./pages/CollectionsPage"));

// Framer Motion for animations
import { AnimatePresence } from "framer-motion";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnReconnect: true,
    },
  },
});

// Loading fallback for lazy components
const LoadingFallback = () => (
  <div className="p-4 space-y-4">
    <LoadingSkeletonCard />
    <LoadingSkeletonCard />
  </div>
);

const AppRoutes = () => {
  const { showOnboarding, completeOnboarding } = useOnboarding();
  
  // Only show routes once onboarding state is determined
  if (showOnboarding === null) {
    return <div className="p-4 flex justify-center items-center h-screen">
      <div className="animate-pulse">Loading...</div>
    </div>;
  }
  
  // Show onboarding if it hasn't been completed yet
  if (showOnboarding) {
    return <OnboardingScreen onComplete={completeOnboarding} />;
  }
  
  // Otherwise show normal routes
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route element={<Layout />}>
          <Route path="/home" element={
            <ErrorBoundary>
              <HomePage />
            </ErrorBoundary>
          } />
          <Route path="/search" element={
            <ErrorBoundary>
              <SearchPage />
            </ErrorBoundary>
          } />
          <Route path="/ingredient-search" element={
            <ErrorBoundary>
              <IngredientSearchPage />
            </ErrorBoundary>
          } />
          <Route path="/favorites" element={
            <ErrorBoundary>
              <FavoritesPage />
            </ErrorBoundary>
          } />
          <Route path="/recipe/:id" element={
            <ErrorBoundary>
              <RecipeDetailPage />
            </ErrorBoundary>
          } />
          <Route 
            path="/meal-planner" 
            element={
              <ErrorBoundary>
                <Suspense fallback={<LoadingFallback />}>
                  <MealPlannerPage />
                </Suspense>
              </ErrorBoundary>
            } 
          />
          <Route 
            path="/shopping-list" 
            element={
              <ErrorBoundary>
                <Suspense fallback={<LoadingFallback />}>
                  <ShoppingListPage />
                </Suspense>
              </ErrorBoundary>
            } 
          />
          <Route 
            path="/collections" 
            element={
              <ErrorBoundary>
                <Suspense fallback={<LoadingFallback />}>
                  <CollectionsPage />
                </Suspense>
              </ErrorBoundary>
            } 
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  // Initialize push notifications
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        await initializePushNotifications();
        setupNotificationListeners();
      } catch (error) {
        console.error("Error setting up notifications:", error);
      }
    };

    initializeNotifications();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Router>
            <AppRoutes />
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
