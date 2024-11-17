import { notFound } from "next/navigation";
import React from "react";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { UserView } from "@/components/users/user-view";
import { findUserById } from "@/lib/actions/users.action";
import { deobfuscateToNumber } from "@/lib/endecode";

const Page = async ({ params }: { params: { userId: string } }) => {
  const user = await findUserById(deobfuscateToNumber(params.userId));

  if (!user) {
    notFound();
  }

  const breadcrumbItems = [
    { title: "Dashboard", link: "/portal" },
    { title: "Users", link: "/portal/users" },
    { title: `${user.firstName} ${user.lastName}`, link: "#" },
  ];

  return (
    <ContentLayout title="Users">
      <Breadcrumbs items={breadcrumbItems} />
      <UserView entity={user} />
    </ContentLayout>
  );
};

export default Page;
