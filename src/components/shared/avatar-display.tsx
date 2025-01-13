"use client";

import React, { useEffect, useState } from "react";

import DefaultTeamLogo from "@/components/teams/team-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DefaultUserLogo from "@/components/users/user-logo";
import { getSecureBlobResource } from "@/lib/actions/commons.action";
import { useError } from "@/providers/error-provider";

interface AvatarDisplayProps {
  imageUrl?: string | null; // Path to the image on the server
  size?: string; // Optional size for the avatar
  className?: string; // Additional CSS classes
  onClick?: () => void; // Click handler
  fallbackContent?: React.ReactNode; // React component or content for fallback
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  imageUrl,
  size = "w-8 h-8",
  className = "",
  onClick,
  fallbackContent,
}) => {
  const { setError } = useError();

  const [protectedImageUrl, setProtectedImageUrl] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const fetchProtectedImage = async () => {
      if (!imageUrl) {
        setProtectedImageUrl(null);
        return;
      }

      try {
        const blob = await getSecureBlobResource(imageUrl, setError);
        if (blob) {
          const objectURL = URL.createObjectURL(blob);
          setProtectedImageUrl(objectURL);
        }
      } catch (error) {
        console.error("Error fetching protected image:", error);
        setProtectedImageUrl(null);
      }
    };

    fetchProtectedImage();

    // Cleanup: Revoke the object URL to free up memory
    return () => {
      if (protectedImageUrl) {
        URL.revokeObjectURL(protectedImageUrl);
      }
    };
  }, [imageUrl]);

  return (
    <Avatar className={`${size} cursor-pointer ${className}`} onClick={onClick}>
      {protectedImageUrl ? (
        <AvatarImage src={protectedImageUrl} />
      ) : (
        <AvatarFallback>{fallbackContent}</AvatarFallback>
      )}
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
