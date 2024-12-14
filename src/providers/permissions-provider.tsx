"use client";

import { useSession } from "next-auth/react";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAccessTokenManager } from "@/lib/access-token-manager";
import { get } from "@/lib/actions/commons.action";
import { BACKEND_API } from "@/lib/constants";
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
const fetchPermissions = async (userId: number): Promise<Permission[]> => {
  return get<Array<Permission>>(
    `${BACKEND_API}/api/users/permissions/${userId}`,
  );
};

// PermissionsProvider component
export const PermissionsProvider: React.FC<PermissionsProviderProps> = ({
  children,
}) => {
  const { data: session, status } = useSession();
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const userId = session?.user?.id ? Number(session.user.id) : null;

  // Make sure session access token is cached
  useAccessTokenManager();

  useEffect(() => {
    if (status === "authenticated" && userId && permissions.length === 0) {
      fetchPermissions(userId).then(setPermissions).catch(console.error);
    }
  }, [status, userId, permissions]);

  // Render null until the session is fully loaded to avoid potential issues
  if (status === "loading") return null;

  return (
    <PermissionsContext.Provider value={{ permissions, setPermissions }}>
      {children}
    </PermissionsContext.Provider>
  );
};
