import React from "react";

import { ResourceProvider } from "@/providers/resource-provider";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ResourceProvider resourceId="Users">
      <div>{children}</div>
    </ResourceProvider>
  );
};

export default Layout;
