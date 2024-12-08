import { ContentLayout } from "@/components/admin-panel/content-layout";
import WorkflowDetailView from "@/components/workflows/workflow-detail-view";
import { deobfuscateToNumber } from "@/lib/endecode";

const Page = ({ params }: { params: { workflowId: string } }) => {
  const workflowId = deobfuscateToNumber(params.workflowId);

  return (
    <ContentLayout title="Workflows">
      <WorkflowDetailView workflowId={workflowId} />
    </ContentLayout>
  );
};

export default Page;
