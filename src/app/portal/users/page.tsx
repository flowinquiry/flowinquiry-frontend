import { SimpleContentView } from "@/components/admin-panel/simple-content-view";
import { UserList } from "@/components/users/user-list";

const breadcrumbItems = [
  { title: "Dashboard", link: "/portal" },
  { title: "Users", link: "/portal/users" },
];

const Page = async () => {
  return (
    <SimpleContentView title="Users" breadcrumbItems={breadcrumbItems}>
      <UserList />
    </SimpleContentView>
  );
};

export default Page;
