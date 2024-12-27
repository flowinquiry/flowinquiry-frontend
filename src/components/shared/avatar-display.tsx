"use client";

import React from "react";

import DefaultTeamLogo from "@/components/teams/team-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DefaultUserLogo from "@/components/users/user-logo";
import { BASE_URL } from "@/lib/constants";

interface AvatarDisplayProps {
  imageUrl?: string | null;
  size?: string;
  className?: string;
  onClick?: () => void;
  fallbackContent?: React.ReactNode;
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  imageUrl,
  size = "w-8 h-8",
  className = "",
  onClick,
  fallbackContent,
}) => {
  return (
    <Avatar className={`${size} cursor-pointer ${className}`} onClick={onClick}>
      <AvatarImage
        src={imageUrl ? `${BASE_URL}/api/files/${imageUrl}` : undefined}
      />
      <AvatarFallback>{fallbackContent}</AvatarFallback>
    </Avatar>
  );
};

interface DefaultAvatarProps {
  imageUrl?: string | null;
  size?: string;
  className?: string;
  onClick?: () => void;
}

export const UserAvatar: React.FC<DefaultAvatarProps> = ({
  imageUrl,
  size = "w-8 h-8",
  className = "",
  onClick,
}) => {
  return (
    <AvatarDisplay
      imageUrl={imageUrl}
      size={size}
      className={className}
      onClick={onClick}
      fallbackContent={<DefaultUserLogo />}
    />
  );
};

export const TeamAvatar: React.FC<DefaultAvatarProps> = ({
  imageUrl,
  size = "w-8 h-8",
  className = "",
  onClick,
}) => {
  return (
    <AvatarDisplay
      imageUrl={imageUrl}
      size={size}
      className={className}
      onClick={onClick}
      fallbackContent={<DefaultTeamLogo />}
    />
  );
};
