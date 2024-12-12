import { ContentLayout } from "@/components/admin-panel/content-layout";
import { AuthorityView } from "@/components/authorities/authority-view";
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
