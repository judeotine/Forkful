
import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface IngredientTagProps {
  ingredient: string;
  onRemove?: (ingredient: string) => void;
  className?: string;
  readOnly?: boolean;
}

const IngredientTag: React.FC<IngredientTagProps> = ({
  ingredient,
  onRemove,
  className,
  readOnly = false,
}) => {
  return (
    <div
      className={cn(
        "flex items-center bg-primary/10 text-primary-foreground rounded-full px-3 py-1 text-sm font-medium",
        className
      )}
    >
      <span className="mr-1">{ingredient}</span>
      {!readOnly && onRemove && (
        <button
          onClick={() => onRemove(ingredient)}
          className="ml-1 rounded-full hover:bg-primary/20 p-0.5"
          aria-label={`Remove ${ingredient}`}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default IngredientTag;
