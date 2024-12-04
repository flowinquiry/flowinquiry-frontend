"use client";

import React from "react";

import { SimpleContentView } from "@/components/admin-panel/simple-content-view";
import { AuthoritiesView } from "@/components/authorities/authority-list";

const breadcrumbItems = [
  { title: "Dashboard", link: "/portal" },
  { title: "Settings", link: "/portal/settings" },
  { title: "Authorities", link: "/portal/settings/authorities" },
];

const AuthoritiesPage = () => {
  return (
    <SimpleContentView title="Authorities" breadcrumbItems={breadcrumbItems}>
      <AuthoritiesView />
    </SimpleContentView>
  );
};

export default AuthoritiesPage;
