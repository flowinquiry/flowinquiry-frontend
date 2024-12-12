"use client";

import { useSession } from "next-auth/react";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { apiClient } from "@/lib/api-client";
import { PermissionLevel, ResourceId } from "@/types/resources";

export type Permission = {
  resourceName: ResourceId;
  permission: PermissionLevel;
};

// Define the context type
interface PermissionsContextType {
  permissions: Permission[];
  setPermissions: (permissions: Permission[]) => void;
}

// Create the context with a default undefined value
const PermissionsContext = createContext<PermissionsContextType | undefined>(
  undefined,
);

// Custom hook to use permissions context
export const usePermissions = (): PermissionsContextType => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
};

// Props for PermissionsProvider
interface PermissionsProviderProps {
  children: ReactNode;
}

// Fetch permissions
const fetchPermissions = async (
  userId: number,
  authToken: string,
): Promise<Permission[]> => {
  return apiClient<Array<Permission>>(
    `/api/users/permissions/${userId}`,
    "GET",
    undefined,
    authToken,
  );
};

// PermissionsProvider component
export const PermissionsProvider: React.FC<PermissionsProviderProps> = ({
  children,
}) => {
  const { data: session, status } = useSession();
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const userId = session?.user?.id ? Number(session.user.id) : null;
  const token = session?.user?.accessToken;

  useEffect(() => {
    if (
      status === "authenticated" &&
      userId &&
      token &&
      permissions.length === 0
    ) {
      fetchPermissions(userId, token).then(setPermissions).catch(console.error);
    }
  }, [status, userId, token, permissions]);

  // Render null until the session is fully loaded to avoid potential issues
  if (status === "loading") return null;

  return (
    <PermissionsContext.Provider value={{ permissions, setPermissions }}>
      {children}
    </PermissionsContext.Provider>
  );
};
