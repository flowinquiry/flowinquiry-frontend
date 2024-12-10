import { ShieldCheck, Shuffle } from "lucide-react";
import Link from "next/link";
import React from "react";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const breadcrumbItems = [
  { title: "Dashboard", link: "/portal" },
  { title: "Settings", link: "/portal/settings" },
];

const Page = () => {
  return (
    <ContentLayout title="Settings">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-row justify-between">
          <Heading
            title="Settings"
            description="Configure and manage all system settings in one place to tailor the platform to your organization's needs."
          />
        </div>
        <Separator />
        <div className=" flex flex-col md:flex-row gap-4">
          <Card id="authorities" className="w-full md:w-[20rem] rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" aria-hidden="true" />
                <Button variant="link" className="px-0 h-0">
                  <Link href="/portal/settings/authorities">Authorities</Link>
                </Button>
              </CardTitle>
              <CardDescription>
                Manage permissions for groups and users to control access to
                resources.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card id="workflows" className="w-full md:w-[20rem] rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shuffle className="w-5 h-5" aria-hidden="true" />
                <Button variant="link" className="px-0 h-0">
                  <Link href="/portal/settings/workflows">Workflows</Link>
                </Button>
              </CardTitle>
              <CardDescription>
                Centralize and manage all workflows effortlessly with clear
                visibility, ticket types, and descriptions at a glance.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </ContentLayout>
  );
};

export default Page;
