"use client";

import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DefaultUserLogo from "@/components/users/user-logo";

interface UserAvatarProps {
  imageUrl?: string | null;
  size?: string;
  className?: string;
  onClick?: () => void;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  imageUrl,
  size = "w-8 h-8",
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
