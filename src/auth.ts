import { AdapterUser } from "@auth/core/adapters";
import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
        return await apiAuthSignIn(credentials);
      },
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
        token.accessToken = user?.accessToken;
        token.id = user.id;
        token.user = user;
      }
      return token;
    },
    session({ session, token }) {
      session.user = token.user as AdapterUser & User;
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
