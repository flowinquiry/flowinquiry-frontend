"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

import DefaultTeamLogo from "@/components/teams/team-logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DefaultUserLogo from "@/components/users/user-logo";
import { BASE_URL } from "@/lib/constants";

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
  const { data: session } = useSession();
  const [protectedImageUrl, setProtectedImageUrl] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const fetchProtectedImage = async () => {
      if (!imageUrl || !session?.user?.accessToken) {
        setProtectedImageUrl(null);
        return;
      }

      try {
        // Fetch the protected image from the server
        const response = await fetch(`${BASE_URL}/api/files/${imageUrl}`, {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch image");
        }

        const blob = await response.blob();
        const objectURL = URL.createObjectURL(blob);

        // Set the object URL for display
        setProtectedImageUrl(objectURL);
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
  }, [imageUrl, session?.user?.accessToken]);

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
