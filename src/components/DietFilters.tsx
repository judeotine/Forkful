
import React from "react";
import { Diet, Intolerance } from "@/services/spoonacularApi";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface DietFiltersProps {
  selectedDiet: Diet | null;
  setSelectedDiet: (diet: Diet | null) => void;
  selectedIntolerances: Intolerance[];
  setSelectedIntolerances: (intolerances: Intolerance[]) => void;
  className?: string;
}

const diets: { value: Diet; label: string }[] = [
  { value: "gluten free", label: "Gluten Free" },
  { value: "ketogenic", label: "Keto" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "paleo", label: "Paleo" },
  { value: "low fodmap", label: "Low FODMAP" },
];

const intolerances: { value: Intolerance; label: string }[] = [
  { value: "dairy", label: "Dairy" },
  { value: "egg", label: "Egg" },
  { value: "gluten", label: "Gluten" },
  { value: "peanut", label: "Peanut" },
  { value: "shellfish", label: "Shellfish" },
  { value: "soy", label: "Soy" },
  { value: "wheat", label: "Wheat" },
  { value: "tree nut", label: "Tree Nut" },
];

const DietFilters: React.FC<DietFiltersProps> = ({
  selectedDiet,
  setSelectedDiet,
  selectedIntolerances,
  setSelectedIntolerances,
  className,
}) => {
  const hasFilters = selectedDiet || selectedIntolerances.length > 0;

  const toggleIntolerance = (intolerance: Intolerance) => {
    if (selectedIntolerances.includes(intolerance)) {
      setSelectedIntolerances(selectedIntolerances.filter((i) => i !== intolerance));
    } else {
      setSelectedIntolerances([...selectedIntolerances, intolerance]);
    }
  };

  const clearFilters = () => {
    setSelectedDiet(null);
    setSelectedIntolerances([]);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium">Dietary Preferences</h3>
        {hasFilters && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={clearFilters}
            className="h-8 text-muted-foreground hover:text-foreground"
          >
            <X size={14} className="mr-1" /> Clear All
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium mb-2">Diet Type</h4>
        <div className="flex flex-wrap gap-2">
          {diets.map((diet) => (
            <Badge
              key={diet.value}
              variant={selectedDiet === diet.value ? "default" : "outline"}
              className={cn(
                "cursor-pointer hover:bg-primary/90 transition-colors",
                selectedDiet === diet.value ? "bg-primary" : "hover:bg-muted"
              )}
              onClick={() => setSelectedDiet(selectedDiet === diet.value ? null : diet.value)}
            >
              {diet.label}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium mb-2">Allergies & Intolerances</h4>
        <div className="flex flex-wrap gap-2">
          {intolerances.map((intolerance) => {
            const isSelected = selectedIntolerances.includes(intolerance.value);
            return (
              <Badge
                key={intolerance.value}
                variant={isSelected ? "destructive" : "outline"}
                className={cn(
                  "cursor-pointer transition-colors",
                  isSelected 
                    ? "" 
                    : "hover:bg-destructive/20 hover:text-destructive-foreground"
                )}
                onClick={() => toggleIntolerance(intolerance.value)}
              >
                {intolerance.label}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DietFilters;
