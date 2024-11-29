import "./globals.css";
import "./theme.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ReactQueryProvider from "@/providers/react-query-provider";
import { ThemeProvider } from "@/providers/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flexwork",
  description: "Flexwork dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning={true} lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        {/* Favicon for modern browsers */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        {/* Fallback favicon for older browsers */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <ReactQueryProvider>
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
