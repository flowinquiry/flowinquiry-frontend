import { ContentLayout } from "@/components/admin-panel/content-layout";
import { AuthorityView } from "@/components/authorities/authority-view";
import { deobfuscateToString } from "@/lib/endecode";

const Page = async (props: { params: Promise<{ authorityId: string }> }) => {
  const params = await props.params;
  const authorityId = deobfuscateToString(params.authorityId);

  return (
    <ContentLayout title="Authorities">
      <AuthorityView authorityId={authorityId} />
    </ContentLayout>
  );
};

export default Page;
