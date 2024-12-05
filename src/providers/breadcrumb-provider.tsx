"use client";

import { createContext, ReactNode, useContext } from "react";

type BreadcrumbItem = { title: string; link: string };

const BreadcrumbContext = createContext<BreadcrumbItem[]>([]);

export const useBreadcrumb = () => useContext(BreadcrumbContext);

export const BreadcrumbProvider = ({
  children,
  items,
}: {
  children: ReactNode;
  items: BreadcrumbItem[];
}) => {
  return (
    <BreadcrumbContext.Provider value={items}>
      {children}
    </BreadcrumbContext.Provider>
  );
};
