import React from "react";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { UserView } from "@/components/users/user-view";
import { deobfuscateToNumber } from "@/lib/endecode";

const Page = async (props: { params: Promise<{ userId: string }> }) => {
  const params = await props.params;
  const userId = deobfuscateToNumber(params.userId);

  return (
    <ContentLayout title="Users">
      <UserView userId={userId} />
    </ContentLayout>
  );
};

export default Page;
