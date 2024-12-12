import { notFound } from "next/navigation";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { AuthorityView } from "@/components/authorities/authority-view";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { findAuthorityByName } from "@/lib/actions/authorities.action";
import { deobfuscateToString } from "@/lib/endecode";

const Page = async ({ params }: { params: { authorityId: string } }) => {
  const authorityId = deobfuscateToString(params.authorityId);

  return (
    <ContentLayout title="Authorities">
      <AuthorityView authorityId={authorityId} />
    </ContentLayout>
  );
};

export default Page;
