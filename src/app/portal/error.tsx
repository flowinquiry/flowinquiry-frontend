"use client"; // Error boundaries must be Client Components

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
      <AlertTriangle className="w-16 h-16 text-red-600" />
      <h1 className="mt-4 text-4xl font-bold text-red-600">Oops!</h1>
      <p className="mt-4 text-lg text-gray-700">
        Something went wrong. We’re working to fix this as soon as possible.
      </p>
      <p className="mt-2 text-sm text-gray-500">
        If the problem persists, please try again or contact support.
      </p>
      <div className="mt-6">
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
          className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700"
        >
          Try Again
        </Button>
      </div>
      <div className="mt-6 text-sm text-gray-500">
        <code>{error.digest || error.message}</code>
      </div>
    </div>
  );
};

export default Error;
