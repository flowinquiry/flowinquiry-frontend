"use client";

import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

import { HttpError } from "@/lib/errors";

type ErrorType = string | HttpError | null;

interface ErrorContextProps {
  setError?: (error: ErrorType) => void; // To set global errors
}

const ErrorContext = createContext<ErrorContextProps | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [error, setError] = useState<ErrorType>(null);

  const handleClose = () => setError(null);

  const router = useRouter();

  useEffect(() => {
    const errorMessage =
      typeof error === "string" ? error : error?.message || null;

    if (
      (error &&
        typeof error === "object" &&
        "status" in error &&
        error.status === 401) ||
      errorMessage?.includes("Token expired or invalid")
    ) {
      // Redirect to login on HTTP 401 status or token expiration
      router.push("/login");
      setError("Unauthorized. Please log in and try again.");
    }
  }, [error, router]);

  // Auto-close the banner after 10 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 10000); // 10 seconds
      return () => clearTimeout(timer); // Cleanup the timer on unmount or when error changes
    }
  }, [error]);

  return (
    <ErrorContext.Provider value={{ setError }}>
      {children}
      {error && (
        <div
          className="fixed bottom-0 left-0 right-0 p-4 bg-red-500 text-white text-center z-50 flex items-center justify-center"
          style={{ minHeight: "50px" }}
        >
          <span className="text-center">
            {typeof error === "string" ? error : error?.message}
          </span>
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
