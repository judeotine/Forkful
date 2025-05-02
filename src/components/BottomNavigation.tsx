
import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Search, Heart, Calendar, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const BottomNavigation: React.FC = () => {
  const navItems = [
    { to: "/home", icon: Home, label: "Home" },
    { to: "/search", icon: Search, label: "Search" },
    { to: "/meal-planner", icon: Calendar, label: "Meal Plan" },
    { to: "/shopping-list", icon: ShoppingCart, label: "Shopping" },
    { to: "/favorites", icon: Heart, label: "Favorites" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-background/80 dark:bg-gray-900/90 backdrop-blur-lg border-t border-border/50 flex items-center justify-around px-2 z-10">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center w-full h-full relative",
              isActive ? "text-primary" : "text-muted-foreground"
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] mt-0.5">{label}</span>
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-px left-1/2 transform -translate-x-1/2 w-10 h-[3px] bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
};

export default BottomNavigation;
