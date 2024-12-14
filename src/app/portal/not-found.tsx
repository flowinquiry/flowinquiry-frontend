"use client";

import { Frown } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import { Button } from "@/components/ui/button";

const NotFound = () => {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
      <Frown className="w-16 h-16 text-gray-500" />
      <h1 className="mt-4 text-3xl font-bold text-gray-800">Page Not Found</h1>
      <p className="mt-2 text-lg text-gray-600">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Button
        className="mt-6 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
        onClick={() => router.back()}
      >
        Go Back
      </Button>
      <p className="mt-4 text-sm text-gray-500">
        If you believe this is an error, please{" "}
        <a href="/contact" className="text-blue-600 hover:underline">
          contact support
        </a>
        .
      </p>
    </main>
  );
};

export default NotFound;
