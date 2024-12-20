import { ContentLayout } from "@/components/admin-panel/content-layout";
import OrgChartView from "@/components/users/org-chart-display";

const Page = () => {
  return (
    <ContentLayout title="Users">
      <OrgChartView />
    </ContentLayout>
  );
};

export default Page;
