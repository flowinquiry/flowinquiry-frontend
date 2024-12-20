import React from "react";
import { Handle, Position } from "@xyflow/react";
import Link from "next/link";
import { UserAvatar } from "@/components/shared/avatar-display";

interface PersonNodeProps {
  data: {
    label: string;
    avatarUrl: string;
    userPageLink: string;
  };
}

const PersonNode = ({ data }: { data: any }) => {
  const { label, avatarUrl, userPageLink, onClick } = data;

  // Detect dark mode
  const isDarkMode =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");

  return (
    <div
      className={`p-4 rounded-lg shadow-md flex flex-col items-center ${
        isDarkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300"
      }`}
      style={{
        width: "200px",
        height: "100px",
      }}
      onClick={onClick} // Call the onClick handler when clicked
    >
      {/* Input and Output Handles for Edges */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ backgroundColor: isDarkMode ? "#d1d5db" : "#6b7280" }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ backgroundColor: isDarkMode ? "#d1d5db" : "#6b7280" }}
      />

      {/* Avatar */}
      <UserAvatar imageUrl={avatarUrl} size="w-12 h-12" className="mb-2" />

      {/* User Name */}
      <Link href={userPageLink}>
        <span
          className={`font-bold text-center ${
            isDarkMode ? "text-blue-400" : "text-blue-600"
          } hover:underline cursor-pointer`}
        >
          {label}
        </span>
      </Link>
    </div>
  );
};

export default PersonNode;
