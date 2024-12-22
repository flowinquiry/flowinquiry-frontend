"use client";

import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

interface ErrorContextProps {
  setError?: (error: string | null) => void; // To set global errors
}

const ErrorContext = createContext<ErrorContextProps | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => setError(null);
  const router = useRouter();

  useEffect(() => {
    if (error?.includes("Token expired or invalid")) {
      // Redirect to login on token expiration
      router.push("/login");
      setError("Unauthorized. Please log in and try again.");
    }
  }, [error, router]);
  return (
    <ErrorContext.Provider value={{ setError }}>
      {children}
      {error && (
        <div
          className="fixed bottom-0 left-0 right-0 p-4 bg-red-500 text-white text-center z-50 flex items-center justify-between"
          style={{ minHeight: "50px" }}
        >
          <span>{error}</span>
          <button
            onClick={handleClose}
            className="ml-4 px-4 py-2 bg-white text-red-500 font-bold rounded hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      )}
    </ErrorContext.Provider>
  );
};

export const useError = (): ErrorContextProps => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};
