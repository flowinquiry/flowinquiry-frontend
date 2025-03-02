"use client";

import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

import TaskSheet, {
  TaskBoard,
} from "@/components/projects/project-ticket-new-sheet";
import {
  findProjectById,
  findProjectWorkflowByTeam,
} from "@/lib/actions/project.action";
import { useError } from "@/providers/error-provider";
import { ProjectDTO } from "@/types/projects";
import { TeamRequestDTO } from "@/types/team-requests";
import { WorkflowDetailDTO } from "@/types/workflows";

// ✅ Dynamic Column Order
const COLUMN_ORDER: string[] = [
  "backlog",
  "ready",
  "inProgress",
  "review",
  "done",
];
const COLUMN_COLORS: Record<string, string> = {
  backlog: "bg-gray-300 dark:bg-gray-700",
  ready: "bg-blue-300 dark:bg-blue-700",
  inProgress: "bg-yellow-300 dark:bg-yellow-600",
  review: "bg-purple-300 dark:bg-purple-700",
  done: "bg-green-300 dark:bg-green-700",
};

// ✅ Add Item Button Colors
const BUTTON_BG_LIGHT = "bg-gray-200 hover:bg-gray-300";
const BUTTON_BG_DARK = "dark:bg-gray-900 dark:hover:bg-gray-800";

export const ProjectView = ({
  teamId,
  projectId,
}: {
  teamId: number;
  projectId: number;
}) => {
  // ✅ Project State
  const [project, setProject] = useState<ProjectDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const { setError } = useError();

  // ✅ Workflow State
  const [workflow, setWorkflow] = useState<WorkflowDetailDTO | null>(null);

  // ✅ Fetch Project & Workflow Data
  useEffect(() => {
    const fetchProjectData = async () => {
      setLoading(true);
      try {
        const projectData = await findProjectById(projectId, setError);
        setProject(projectData);

        // Fetch Workflow
        const workflowData = await findProjectWorkflowByTeam(teamId, setError);
        setWorkflow(workflowData);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [teamId, projectId]);

  // ✅ Dynamic Task Board
  const [tasks, setTasks] = useState<TaskBoard>({});

  // Track Dragging Task
  const [activeTask, setActiveTask] = useState<TeamRequestDTO | null>(null);
  // Track Selected Task
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  // Track Add Task Sheet State
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // ✅ Handle Drag Start
  const handleDragStart = (event: any) => {
    const activeId = event.active.id.toString();
    setSelectedTaskId(activeId);

    const column = COLUMN_ORDER.find((key) =>
      tasks[key]?.some((task) => task.id?.toString() === activeId),
    );

    if (column) {
      const task = tasks[column]?.find(
        (task) => task.id?.toString() === activeId,
      );
      if (task) setActiveTask(task);
    }
  };

  // ✅ Handle Drag End
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    const sourceColumn = COLUMN_ORDER.find((key) =>
      tasks[key]?.some((task) => task.id?.toString() === activeId),
    );
    const targetColumn = COLUMN_ORDER.includes(overId) ? overId : undefined;

    if (!sourceColumn || !targetColumn || sourceColumn === targetColumn) return;

    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };

      const taskToMove = updatedTasks[sourceColumn]?.find(
        (task) => task.id?.toString() === activeId,
      );
      if (!taskToMove) return prevTasks;

      updatedTasks[sourceColumn] = updatedTasks[sourceColumn]?.filter(
        (task) => task.id?.toString() !== activeId,
      );
      updatedTasks[targetColumn] = [
        ...(updatedTasks[targetColumn] || []),
        taskToMove,
      ];

      return updatedTasks;
    });
  };

  return (
    <div className="p-6 h-screen flex flex-col overflow-hidden">
      {/* ✅ Display Project Header */}
      {loading ? (
        <p className="text-lg font-semibold">Loading project...</p>
      ) : project ? (
        <>
          <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
          <div
            className="text-gray-600 dark:text-gray-300 text-sm mb-4"
            dangerouslySetInnerHTML={{ __html: project.description ?? "" }}
          />
        </>
      ) : (
        <p className="text-red-500">Project not found.</p>
      )}

      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-grow gap-4 overflow-auto">
          {COLUMN_ORDER.map((column) => (
            <Column
              key={column}
              id={column}
              title={column}
              tasks={tasks[column] || []}
              setIsSheetOpen={setIsSheetOpen}
              setSelectedColumn={setSelectedColumn}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <Task
              id={activeTask.id!}
              title={activeTask.requestTitle}
              isDragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* ✅ Task Sheet */}
      <TaskSheet
        isOpen={isSheetOpen}
        setIsOpen={setIsSheetOpen}
        selectedColumn={selectedColumn}
        setTasks={setTasks}
        teamId={project?.teamId!}
        projectWorkflowId={workflow?.id!}
      />
    </div>
  );
};

// ✅ Task Component
const Task = ({
  id,
  title,
  isDragging = false,
}: {
  id: number;
  title: string;
  isDragging?: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: id.toString(),
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        cursor: isDragging ? "grabbing" : "pointer",
      }}
      {...attributes}
      {...listeners}
      className="p-2 rounded-lg shadow-md mb-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
    >
      {title}
    </div>
  );
};

// ✅ Column Component
const Column = ({
  id,
  title,
  tasks,
  setIsSheetOpen,
  setSelectedColumn,
}: {
  id: string;
  title: string;
  tasks: TeamRequestDTO[];
  setIsSheetOpen: (open: boolean) => void;
  setSelectedColumn: (column: string | null) => void;
}) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        "flex flex-col flex-grow h-full p-4 rounded shadow border border-gray-400 dark:border-gray-600",
        COLUMN_COLORS[id],
      )}
    >
      <h2 className="text-lg font-bold mb-4 capitalize">{title}</h2>
      <div className="flex-grow overflow-y-auto scroll-smooth">
        <SortableContext items={tasks.map((task) => task.id!.toString())}>
          {tasks.map((task) => (
            <Task key={task.id} id={task.id!} title={task.requestTitle} />
          ))}
        </SortableContext>
      </div>
      {/* ✅ Add Item Button */}
      <button
        onClick={() => {
          setSelectedColumn(id);
          setIsSheetOpen(true);
        }}
        className={clsx(
          "mt-2 w-full flex items-center justify-center gap-2 py-2 border rounded-lg",
          BUTTON_BG_LIGHT,
          BUTTON_BG_DARK,
        )}
      >
        <Plus className="w-5 h-5" /> Add item
      </button>
    </div>
  );
};

export default ProjectView;
