import { notFound } from "next/navigation";
import React from "react";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { UserView } from "@/components/users/user-view";
import { findUserById } from "@/lib/actions/users.action";
import { deobfuscateToNumber } from "@/lib/endecode";

const Page = async ({ params }: { params: { userId: string } }) => {
  const userId = deobfuscateToNumber(params.userId);

  return (
    <ContentLayout title="Users">
      <UserView userId={userId} />
    </ContentLayout>
  );
};

export default Page;
