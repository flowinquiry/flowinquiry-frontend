import "./globals.css";
import "./theme.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import AutoInitBackendApi from "@/components/init-api-backend";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { setBackendUrl, setBaseUrl } from "@/lib/runtime-variables";
import { ErrorProvider } from "@/providers/error-provider";
import ReactQueryProvider from "@/providers/react-query-provider";
import { ThemeProvider } from "@/providers/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FlowInquiry",
  description: "FlowInquiry dashboard",
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    throw new Error("BACKEND_URL is not defined in the environment");
  }
  setBackendUrl(backendUrl);

  // Base url is the mandatory field in environments except local
  const baseUrl = process.env.BASE_URL;
  setBaseUrl(baseUrl);

  return (
    <html suppressHydrationWarning={true} lang="en">
      <head>
        <title>FlowInquiry - Ticket Management</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        {/* Favicon for modern browsers */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        {/* Fallback favicon for older browsers */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
      </head>
      <body className={inter.className}>
        <script
          id="runtime-config"
          dangerouslySetInnerHTML={{
            __html: `window.BASE_URL="${baseUrl}";`,
          }}
        />
        <ErrorProvider>
          <ThemeProvider attribute="class" defaultTheme="system">
            <ReactQueryProvider>
              <TooltipProvider>
                <AutoInitBackendApi /> {children}
              </TooltipProvider>
              <Toaster />
            </ReactQueryProvider>
          </ThemeProvider>
        </ErrorProvider>
      </body>
    </html>
  );
};

export default RootLayout;
