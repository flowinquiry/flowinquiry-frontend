import React from "react";

import { ResourceProvider } from "@/providers/resource-provider";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ResourceProvider resourceId="Workflows">
      <div>{children}</div>
    </ResourceProvider>
  );
};

export default Layout;
