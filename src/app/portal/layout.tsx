import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";

import { auth } from "@/auth";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { PermissionsProvider } from "@/providers/permissions-provider";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (!session) {
    console.log("No session is detected. Redirect to login page");
    redirect("/login");
  }

  return (
    <SessionProvider session={session}>
      <PermissionsProvider>
        <AdminPanelLayout>{children}</AdminPanelLayout>
      </PermissionsProvider>
    </SessionProvider>
  );
};

export default Layout;
