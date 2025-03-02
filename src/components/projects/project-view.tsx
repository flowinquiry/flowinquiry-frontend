"use client";

import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import React, { useEffect, useState } from "react";

import TaskSheet, {
  TaskBoard,
} from "@/components/projects/project-ticket-new-sheet";
import Column from "@/components/projects/project-view-column";
import Task from "@/components/projects/project-view-task";
import {
  findProjectById,
  findProjectWorkflowByTeam,
} from "@/lib/actions/project.action";
import { useError } from "@/providers/error-provider";
import { ProjectDTO } from "@/types/projects";
import { TeamRequestDTO } from "@/types/team-requests";
import { WorkflowDetailDTO } from "@/types/workflows";

// ✅ Function to generate unique colors for workflow states
const getColumnColor = (stateId: number): string => {
  const colors = [
    "bg-gray-300 dark:bg-gray-700",
    "bg-blue-300 dark:bg-blue-700",
    "bg-yellow-300 dark:bg-yellow-600",
    "bg-purple-300 dark:bg-purple-700",
    "bg-green-300 dark:bg-green-700",
    "bg-red-300 dark:bg-red-700",
    "bg-teal-300 dark:bg-teal-700",
    "bg-pink-300 dark:bg-pink-700",
  ];
  return colors[stateId % colors.length];
};

export const ProjectView = ({
  teamId,
  projectId,
}: {
  teamId: number;
  projectId: number;
}) => {
  // ✅ Project & Workflow State
  const [project, setProject] = useState<ProjectDTO | null>(null);
  const [workflow, setWorkflow] = useState<WorkflowDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const { setError } = useError();

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

  // ✅ Dynamic Task Board (Tasks categorized by Workflow State ID)
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

    const column = workflow?.states.find((state) =>
      tasks[state.id!.toString()]?.some(
        (task) => task.id?.toString() === activeId,
      ),
    );

    if (column) {
      const task = tasks[column.id!.toString()]?.find(
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

    const sourceColumn = workflow?.states.find((state) =>
      tasks[state.id!.toString()]?.some(
        (task) => task.id?.toString() === activeId,
      ),
    );

    const targetColumn = workflow?.states.find(
      (state) => state.id!.toString() === overId,
    );

    if (!sourceColumn || !targetColumn || sourceColumn.id === targetColumn.id)
      return;

    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };

      const taskToMove = updatedTasks[sourceColumn.id!.toString()]?.find(
        (task) => task.id?.toString() === activeId,
      );
      if (!taskToMove) return prevTasks;

      updatedTasks[sourceColumn.id!.toString()] = updatedTasks[
        sourceColumn.id!.toString()
      ]?.filter((task) => task.id?.toString() !== activeId);

      updatedTasks[targetColumn.id!.toString()] = [
        ...(updatedTasks[targetColumn.id!.toString()] || []),
        taskToMove,
      ];

      return updatedTasks;
    });
  };

  return (
    <div className="p-6 h-screen flex flex-col">
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
        {/* 🛠 Fix: Full height scrollable container */}
        <div className="flex flex-grow overflow-x-auto gap-4 pb-2">
          {workflow?.states
            .sort((a, b) => {
              if (a.isInitial && !b.isInitial) return -1;
              if (!a.isInitial && b.isInitial) return 1;
              if (a.isFinal && !b.isFinal) return 1;
              if (!a.isFinal && b.isFinal) return -1;
              return 0;
            })
            .map((state) => (
              <Column
                key={state.id}
                workflowState={state}
                tasks={tasks[state.id!.toString()] || []}
                setIsSheetOpen={setIsSheetOpen}
                setSelectedColumn={setSelectedColumn}
                columnColor={getColumnColor(state.id!)}
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

export default ProjectView;
