
import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonCardProps {
  variant?: "default" | "compact";
}

const LoadingSkeletonCard: React.FC<LoadingSkeletonCardProps> = ({ 
  variant = "default" 
}) => {
  if (variant === "compact") {
    return (
      <Card className="overflow-hidden">
        <div className="flex">
          <Skeleton className="w-24 h-24" />
          <div className="p-3 flex-1">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <div className="flex space-x-1 mt-1">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <Skeleton className="w-full h-48" />
      <div className="p-4">
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-5/6 mb-4" />
        <div className="flex space-x-2 mt-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </Card>
  );
};

export default LoadingSkeletonCard;
