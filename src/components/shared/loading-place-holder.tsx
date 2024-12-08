"use client";

import React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

interface LoadingPlaceholderProps {
  message?: string; // Optional message to display
  skeletonCount?: number; // Number of skeleton lines to render
  skeletonWidth?: string; // Width of the skeleton lines
}

const LoadingPlaceholder: React.FC<LoadingPlaceholderProps> = ({
  message = "Loading...",
  skeletonCount = 3,
  skeletonWidth = "20rem",
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Spinner className="h-8 w-8" />
      <span>{message}</span>

      <div className="space-y-2">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <Skeleton key={index} className={`h-4 w-[${skeletonWidth}]`} />
        ))}
      </div>
    </div>
  );
};

export default LoadingPlaceholder;
