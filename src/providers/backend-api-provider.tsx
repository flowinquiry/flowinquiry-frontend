"use client";

import React, { createContext, ReactNode, useContext } from "react";

// Create a context for BACKEND_API
const BackendApiContext = createContext<string | null>(null);

// Custom hook to access the BACKEND_API context
export const useBackendApi = () => {
  const context = useContext(BackendApiContext);
  if (!context) {
    throw new Error("useBackendApi must be used within a BackendApiProvider");
  }
  return context;
};

// Context provider component
export const BackendApiProvider = ({
  children,
  backendApi,
}: {
  children: ReactNode;
  backendApi: string;
}) => {
  return (
    <BackendApiContext.Provider value={backendApi}>
      {children}
    </BackendApiContext.Provider>
  );
};
