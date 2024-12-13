import { SimpleContentView } from "@/components/admin-panel/simple-content-view";
import AuthorityForm from "@/components/authorities/authority-form";
import { deobfuscateToString } from "@/lib/endecode";

const Page = async (props: {
  params: Promise<{ authorityId: string | "new" }>;
}) => {
  const params = await props.params;
  const authorityId =
    params.authorityId !== "new"
      ? deobfuscateToString(params.authorityId)
      : undefined;

  return (
    <SimpleContentView title="Authorities">
      <AuthorityForm authorityId={authorityId} />
    </SimpleContentView>
  );
};

export default Page;
