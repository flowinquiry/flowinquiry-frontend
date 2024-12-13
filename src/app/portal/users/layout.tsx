import React from "react";

import { ResourceProvider } from "@/providers/resource-provider";

const TeamsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ResourceProvider resourceId="Users">
      <div>{children}</div>
    </ResourceProvider>
  );
};

export default TeamsLayout;
