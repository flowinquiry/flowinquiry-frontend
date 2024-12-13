import { SimpleContentView } from "@/components/admin-panel/simple-content-view";
import { ProfileForm } from "@/components/forms/profile-form";

const breadcrumbItems = [
  { title: "Dashboard", link: "/portal" },
  { title: "Profile", link: "/portal/profile" },
];

const Page = () => {
  return (
    <SimpleContentView title="Profile" breadcrumbItems={breadcrumbItems}>
      <ProfileForm />
    </SimpleContentView>
  );
};

export default Page;
