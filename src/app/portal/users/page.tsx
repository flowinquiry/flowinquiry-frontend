import { SimpleContentView } from "@/components/admin-panel/simple-content-view";
import { UserList } from "@/components/users/user-list";

const breadcrumbItems = [
  { title: "Dashboard", link: "/portal" },
  { title: "Users", link: "/portal/users" },
];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const Users = async ({ searchParams }: paramsProps) => {
  return (
    <SimpleContentView title="Users" breadcrumbItems={breadcrumbItems}>
      <UserList />
    </SimpleContentView>
  );
};

export default Users;
