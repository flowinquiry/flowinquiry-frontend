import "./globals.css";
import "./theme.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import AutoInitBackendApi from "@/components/init-api-backend";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { setBackendApi } from "@/lib/runtime-variables";
import { BackendApiProvider } from "@/providers/backend-api-provider";
import { ErrorProvider } from "@/providers/error-provider";
import ReactQueryProvider from "@/providers/react-query-provider";
import { ThemeProvider } from "@/providers/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FlowInquiry",
  description: "FlowInquiry dashboard",
};

// Server-side function to fetch the BACKEND_API dynamically
async function getBackendApi(): Promise<string> {
  const backendApi = process.env.BACKEND_API;
  if (!backendApi) {
    throw new Error("BACKEND_API is not defined in the environment");
  }
  return backendApi;
}

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const backendApi = await getBackendApi();

  setBackendApi(backendApi);

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
            __html: `window.BACKEND_API="${backendApi}";`,
          }}
        />
        <BackendApiProvider backendApi={backendApi}>
          <ErrorProvider>
            <ThemeProvider attribute="class" defaultTheme="system">
              <ReactQueryProvider>
                <TooltipProvider>
                  <AutoInitBackendApi />{" "}
                  {/* Initialize BACKEND_API on client */}
                  {children}
                </TooltipProvider>
                <Toaster />
              </ReactQueryProvider>
            </ThemeProvider>
          </ErrorProvider>
        </BackendApiProvider>
      </body>
    </html>
  );
};

export default RootLayout;
