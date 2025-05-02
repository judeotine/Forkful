
import React from "react";
import { Utensils } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlaceholderImageProps {
  className?: string;
  iconSize?: number;
}

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({ 
  className, 
  iconSize = 24 
}) => {
  return (
    <div 
      className={cn(
        "w-full h-full flex items-center justify-center bg-muted/50",
        className
      )}
    >
      <Utensils size={iconSize} className="text-muted-foreground opacity-50" />
    </div>
  );
};

export default PlaceholderImage;
