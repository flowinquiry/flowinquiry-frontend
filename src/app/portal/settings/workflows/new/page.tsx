import { SimpleContentView } from "@/components/admin-panel/simple-content-view";
import WorkflowNew from "@/components/workflows/workflow-new";

const Page = () => {
  return (
    <SimpleContentView title="Workflows">
      <WorkflowNew />
    </SimpleContentView>
  );
};

export default Page;
