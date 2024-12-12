import React from "react";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { UserView } from "@/components/users/user-view";
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
