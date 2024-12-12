import React from "react";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { BreadcrumbItemProps, Breadcrumbs } from "@/components/breadcrumbs";

interface ISimpleContentViewProps {
  title: string;
  breadcrumbItems?: BreadcrumbItemProps[];
  children: React.ReactNode;
}

export const SimpleContentView: React.FC<ISimpleContentViewProps> = ({
  title,
  breadcrumbItems,
  children,
}) => {
  return (
    <ContentLayout title={title}>
      {breadcrumbItems && <Breadcrumbs items={breadcrumbItems} />}
      <div className="grid grid-cols-1 py-2 gap-2">{children}</div>
    </ContentLayout>
  );
};
