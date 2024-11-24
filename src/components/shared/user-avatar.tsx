"use client";

import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DefaultUserLogo from "@/components/users/user-logo";

interface UserAvatarProps {
  imageUrl?: string | null; // URL for the user's image
  size?: string; // Tailwind class for size (e.g., "w-8 h-8")
  className?: string; // Additional classes
  onClick?: () => void; // Optional click handler
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  imageUrl,
  size = "w-8 h-8", // Default size
  className = "",
  onClick,
}) => {
  return (
    <Avatar className={`${size} cursor-pointer ${className}`} onClick={onClick}>
      <AvatarImage src={imageUrl ? `/api/files/${imageUrl}` : undefined} />
      <AvatarFallback>
        <DefaultUserLogo />
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
