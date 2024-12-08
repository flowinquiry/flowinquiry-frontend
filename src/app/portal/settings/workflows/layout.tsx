import React from "react";

import { ResourceProvider } from "@/providers/resource-provider";

export default function WorkflowsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ResourceProvider resourceId="Workflows">
      <div>{children}</div>
    </ResourceProvider>
  );
}
