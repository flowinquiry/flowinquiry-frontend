import { SimpleContentView } from "@/components/admin-panel/simple-content-view";
import { UserForm } from "@/components/users/user-form";
import { deobfuscateToNumber } from "@/lib/endecode";

const Page = async (props: { params: Promise<{ userId: string | "new" }> }) => {
  const params = await props.params;
  const userId =
    params.userId !== "new" ? deobfuscateToNumber(params.userId) : undefined;

  const breadcrumbItems = [
    { title: "Dashboard", link: "/portal" },
    { title: "Users", link: "/portal/users" },
    { title: "Create", link: "/portal/users/edit/new" },
  ];

  return (
    <SimpleContentView title="Users" breadcrumbItems={breadcrumbItems}>
      <UserForm userId={userId} />
    </SimpleContentView>
  );
};

export default Page;
