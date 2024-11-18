"use client";

import React, { createContext, ReactNode, useContext } from "react";

import { ResourceId } from "@/types/resources";

// Define the context type
interface ResourceContextType {
  resourceId: ResourceId;
}

// Create the context
const ResourceContext = createContext<ResourceContextType | undefined>(
  undefined,
);

// Custom hook to use the ResourceContext
export const useResourceId = (): ResourceContextType => {
  const context = useContext(ResourceContext);
  if (!context) {
    throw new Error("useResource must be used within a ResourceProvider");
  }
  return context;
};

// Props for ResourceProvider
interface ResourceProviderProps {
  children: ReactNode;
  resourceId: ResourceId | undefined;
}

// ResourceProvider component
export const ResourceProvider: React.FC<ResourceProviderProps> = ({
  children,
  resourceId,
}) => {
  if (!resourceId) {
    throw new Error(
      "ResourceProvider: `resourceID` metadata is required but not provided.",
    );
  }

  return (
    <ResourceContext.Provider value={{ resourceId }}>
      {children}
    </ResourceContext.Provider>
  );
};
