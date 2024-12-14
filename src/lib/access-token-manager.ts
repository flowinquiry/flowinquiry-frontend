import { useSession } from "next-auth/react";

let cachedAccessToken: string | null = null;

export const useAccessTokenManager = () => {
  const { data: session } = useSession();

  if (
    session?.user?.accessToken &&
    cachedAccessToken !== session.user.accessToken
  ) {
    cachedAccessToken = session?.user.accessToken;
  }

  return cachedAccessToken;
};

// Getter function to access the cached token
export const getAccessToken = () => {
  if (!cachedAccessToken) {
    throw new Error("Access token is not available. Ensure user is logged in.");
  }
  return cachedAccessToken;
};
