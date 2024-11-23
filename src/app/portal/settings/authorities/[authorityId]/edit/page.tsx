import { SimpleContentView } from "@/components/admin-panel/simple-content-view";
import AuthorityForm from "@/components/authorities/authority-form";
import { findAuthorityByName } from "@/lib/actions/authorities.action";
import { deobfuscateToString, obfuscate } from "@/lib/endecode";

export default async function Page({
  params,
}: {
  params: { authorityId: string | "new" };
}) {
  const authority =
    params.authorityId !== "new"
      ? await findAuthorityByName(deobfuscateToString(params.authorityId))
      : undefined;

  const breadcrumbItems = [
    { title: "Dashboard", link: "/portal" },
    { title: "Authorities", link: "/portal/settings/authorities" },
    ...(authority
      ? [
          {
            title: `${authority.descriptiveName}`,
            link: `/portal/settings/authorities/${obfuscate(authority.name)}`,
          },
          { title: "Edit", link: "#" },
        ]
      : [{ title: "Add", link: "#" }]),
  ];

  return (
    <SimpleContentView title="Authorities" breadcrumbItems={breadcrumbItems}>
      <AuthorityForm authorityEntity={authority} />
    </SimpleContentView>
  );
}
