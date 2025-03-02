"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import clsx from "clsx";
import { motion } from "framer-motion"; // 🎯 Import Framer Motion
import { Plus } from "lucide-react";

import Task from "@/components/projects/project-view-task";
import { TeamRequestDTO } from "@/types/team-requests";
import { WorkflowStateDTO } from "@/types/workflows";

const BUTTON_COLOR =
  "bg-gray-400 dark:bg-gray-800 hover:bg-gray-500 dark:hover:bg-gray-900";

const Column = ({
  workflowState,
  tasks,
  setIsSheetOpen,
  setSelectedWorkflowState,
  columnColor,
}: {
  workflowState: WorkflowStateDTO;
  tasks: TeamRequestDTO[];
  setIsSheetOpen: (open: boolean) => void;
  setSelectedWorkflowState: (state: WorkflowStateDTO) => void;
  columnColor: string;
}) => {
  const { setNodeRef } = useDroppable({ id: workflowState.id!.toString() });

  return (
    <motion.div
      ref={setNodeRef}
      className={clsx(
        "flex flex-col flex-grow min-w-[28rem] max-w-[36rem] p-4 rounded shadow border",
        columnColor,
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <h2 className="text-lg font-bold mb-4 capitalize">
        {workflowState.stateName}
      </h2>

      {/* ✅ Sortable Context with Animated Task List */}
      <SortableContext
        id={workflowState.id!.toString()}
        items={tasks.map((task) => task.id!.toString())}
        strategy={verticalListSortingStrategy}
      >
        <motion.div
          className="flex-grow overflow-y-auto"
          layout // 🎯 Enables smooth reordering animations
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {tasks.map((task) => (
            <Task key={task.id} id={task.id!} title={task.requestTitle} />
          ))}
        </motion.div>
      </SortableContext>

      <motion.button
        onClick={() => {
          setSelectedWorkflowState(workflowState);
          setIsSheetOpen(true);
        }}
        className={clsx(
          "mt-2 w-full flex items-center justify-center gap-2 py-2 border rounded-lg text-white font-semibold transition",
          BUTTON_COLOR,
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus className="w-5 h-5" /> Add item
      </motion.button>
    </motion.div>
  );
};

export default Column;
