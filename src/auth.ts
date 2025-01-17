import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import apiAuthSignIn from "@/lib/auth";
import { BASE_URL } from "@/lib/constants";

export const { handlers, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Partial<Record<"email" | "password", unknown>> | undefined,
      ) {
        if (!credentials) {
          throw new Error("Invalid credentials");
        }
        const user = await apiAuthSignIn(credentials);
        // Ensure the user object contains the required fields
        if (!user || !user.id || !user.email || !user.accessToken) {
          throw new Error("Authentication failed");
        }
        // Return an object that matches AdapterUser type
        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Works for the deployment model while API_URL is the front url of the reverse proxy
      else if (
        process.env.NODE_ENV === "production" &&
        new URL(url).origin === BASE_URL
      )
        return url;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    jwt({ token, account, user }) {
      if (user) {
        token.accessToken = user.accessToken as string; // Credentials-based accessToken
        token.id = user.id as string; // User ID from either credentials or OAuth2
        token.user = user; // Full user object for credentials
      }
      // If account exists (OAuth2 flow)
      if (account) {
        token.accessToken = account.access_token as string; //  Social token from the provider
        token.provider = account.provider as string; // e.g., "google"
      }
      return token;
    },
    session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.provider = token.provider as string; // Add provider for OAuth2
      session.user = token.user || session.user; // Include user object if available
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // Maximum session age in seconds (30 days)
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== "production",
});
