import Task from "@/components/projects/project-view-task";
import { TeamRequestDTO } from "@/types/team-requests";
import { WorkflowStateDTO } from "@/types/workflows";

type ColumnProps = {
  workflowState: WorkflowStateDTO;
  tasks: TeamRequestDTO[];
  setIsSheetOpen: (open: boolean) => void;
  setSelectedColumn: (column: string | null) => void;
  columnColor: string; // ✅ Ensure it's a single string
};

const Column: React.FC<ColumnProps> = ({
  workflowState,
  tasks,
  setIsSheetOpen,
  setSelectedColumn,
  columnColor,
}) => {
  return (
    <div
      className={`flex flex-col flex-shrink-0 w-64 min-w-[30rem] max-w-[36rem] h-full p-4 rounded shadow border border-gray-400 dark:border-gray-600 ${columnColor}`}
    >
      <h2 className="text-lg font-bold mb-4 capitalize">
        {workflowState.stateName}
      </h2>
      <div className="flex-grow overflow-y-auto scroll-smooth">
        {tasks.map((task) => (
          <Task key={task.id} id={task.id!} title={task.requestTitle} />
        ))}
      </div>

      {/* ✅ Add Task Button at the bottom */}
      <button
        onClick={() => {
          setSelectedColumn(workflowState.id!.toString());
          setIsSheetOpen(true);
        }}
        className="mt-2 w-full flex items-center justify-center gap-2 py-2 border rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-900 dark:hover:bg-gray-800"
      >
        + Add Item
      </button>
    </div>
  );
};

export default Column;
