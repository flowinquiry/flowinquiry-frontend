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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { findProjectById } from "@/lib/actions/project.action";
import { useError } from "@/providers/error-provider";
import { ProjectDTO } from "@/types/projects";

// Define Task Type
type Task = {
  id: string;
  title: string;
};

// Define Columns & Colors
const COLUMN_ORDER = [
  "backlog",
  "ready",
  "inProgress",
  "review",
  "done",
] as const;
const COLUMN_COLORS: Record<(typeof COLUMN_ORDER)[number], string> = {
  backlog: "bg-gray-300 dark:bg-gray-700",
  ready: "bg-blue-300 dark:bg-blue-700",
  inProgress: "bg-yellow-300 dark:bg-yellow-600",
  review: "bg-purple-300 dark:bg-purple-700",
  done: "bg-green-300 dark:bg-green-700",
};

// Add Item Button Colors
const BUTTON_BG_LIGHT = "bg-gray-200 hover:bg-gray-300";
const BUTTON_BG_DARK = "dark:bg-gray-900 dark:hover:bg-gray-800";

// Define Task Board Type
type TaskBoard = Record<(typeof COLUMN_ORDER)[number], Task[]>;

export const ProjectView = ({ projectId }: { projectId: number }) => {
  // State for project data
  const [project, setProject] = useState<ProjectDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const { setError } = useError();

  // Fetch Project Data
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const data = await findProjectById(projectId, setError);
        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  // Initial Tasks
  const [tasks, setTasks] = useState<TaskBoard>({
    backlog: [],
    ready: [],
    inProgress: [],
    review: [],
    done: [],
  });

  // Track the active dragging task
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  // Track the selected task for focus
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Track task input & column
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Handle Drag Start
  const handleDragStart = (event: any) => {
    const activeId = event.active.id.toString();
    setSelectedTaskId(activeId);

    const column = COLUMN_ORDER.find((key) =>
      tasks[key].some((task) => task.id === activeId),
    );

    if (column) {
      const task = tasks[column].find((task) => task.id === activeId);
      if (task) setActiveTask(task);
    }
  };

  // Handle Drag End
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    const sourceColumn = COLUMN_ORDER.find((key) =>
      tasks[key].some((task) => task.id === activeId),
    );
    const targetColumn = COLUMN_ORDER.includes(overId as any)
      ? (overId as keyof TaskBoard)
      : COLUMN_ORDER.find((key) =>
          tasks[key].some((task) => task.id === overId),
        );

    if (!sourceColumn || !targetColumn) return;
    if (sourceColumn === targetColumn) return;

    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };

      const taskToMove = updatedTasks[sourceColumn].find(
        (task) => task.id === activeId,
      );
      if (!taskToMove) return prevTasks;

      updatedTasks[sourceColumn] = updatedTasks[sourceColumn].filter(
        (task) => task.id !== activeId,
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
      {/* Display Project Header */}
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
              tasks={tasks[column]}
              setIsSheetOpen={setIsSheetOpen}
              setSelectedColumn={setSelectedColumn}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <Task
              id={activeTask.id}
              title={activeTask.title}
              isDragging={true}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Task Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Add New Task</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 mt-4">
            <Input
              placeholder="Enter task title..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <div className="flex justify-end">
              <Button
                onClick={() => setIsSheetOpen(false)}
                disabled={!newTaskTitle.trim()}
              >
                Save Task
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

// ✅ **Task Component**
const Task = ({
  id,
  title,
  isDragging = false,
}: {
  id: string;
  title: string;
  isDragging?: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({ id });

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

// ✅ **Column Component**
const Column = ({
  id,
  title,
  tasks,
  setIsSheetOpen,
  setSelectedColumn,
}: {
  id: keyof TaskBoard;
  title: string;
  tasks: Task[];
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
        <SortableContext items={tasks.map((task) => task.id)}>
          {tasks.map((task) => (
            <Task key={task.id} id={task.id} title={task.title} />
          ))}
        </SortableContext>
      </div>
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
