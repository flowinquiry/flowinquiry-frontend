"use client";

import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import React, { useEffect, useState } from "react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import TaskSheet, {
  TaskBoard,
} from "@/components/projects/project-ticket-new-sheet";
import Column from "@/components/projects/project-view-column";
import Task from "@/components/projects/project-view-task";
import {
  findProjectById,
  findProjectWorkflowByTeam,
} from "@/lib/actions/project.action";
import {
  searchTeamRequests,
  updateTeamRequestState,
} from "@/lib/actions/teams-request.action";
import { obfuscate } from "@/lib/endecode";
import { useError } from "@/providers/error-provider";
import { useTeam } from "@/providers/team-provider";
import { ProjectDTO } from "@/types/projects";
import { Pagination, QueryDTO } from "@/types/query";
import { TeamRequestDTO } from "@/types/team-requests";
import { WorkflowDetailDTO, WorkflowStateDTO } from "@/types/workflows";

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

export const ProjectView = ({ projectId }: { projectId: number }) => {
  const team = useTeam();
  const [project, setProject] = useState<ProjectDTO | null>(null);
  const [workflow, setWorkflow] = useState<WorkflowDetailDTO | null>(null);
  const [tasks, setTasks] = useState<TaskBoard>({});
  const [loading, setLoading] = useState(true);
  const { setError } = useError();

  // Track Dragging Task
  const [activeTask, setActiveTask] = useState<TeamRequestDTO | null>(null);
  // Track Selected Task
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  // Track Add Task Sheet State
  const [selectedWorkflowState, setSelectedWorkflowState] =
    useState<WorkflowStateDTO | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // ✅ Fetch Project, Workflow & Tasks
  useEffect(() => {
    const fetchProjectData = async () => {
      setLoading(true);
      try {
        const projectData = await findProjectById(projectId, setError);
        setProject(projectData);

        // Fetch Workflow
        const workflowData = await findProjectWorkflowByTeam(
          team.id!,
          setError,
        );
        setWorkflow(workflowData);

        if (workflowData) {
          // ✅ Fetch All Tasks Iteratively
          let allTasks: TeamRequestDTO[] = [];
          let currentPage = 1;
          const pageSize = 100;
          let totalElements = 0;

          do {
            const query: QueryDTO = {
              filters: [
                { field: "project.id", value: projectId, operator: "eq" },
              ],
            };
            const pagination: Pagination = {
              page: currentPage,
              size: pageSize,
              sort: [{ field: "id", direction: "desc" }], // ✅ Ensure order consistency
            };

            const tasksData = await searchTeamRequests(
              query,
              pagination,
              setError,
            );
            allTasks = [...allTasks, ...tasksData.content];
            totalElements = tasksData.totalElements;

            currentPage++;
          } while (allTasks.length < totalElements); // ✅ Fetch until we get all tasks

          // ✅ Allocate Tasks to Columns based on Workflow States
          const newTasks: TaskBoard = {};
          workflowData.states.forEach((state) => {
            newTasks[state.id!.toString()] = allTasks.filter(
              (task) => task.currentStateId === state.id,
            );
          });

          setTasks(newTasks);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [team, projectId]);

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

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    // ✅ Check if dragging over a column or a task inside a column
    const targetColumn = workflow?.states.find(
      (state) =>
        state.id!.toString() === overId ||
        tasks[state.id!.toString()]?.some(
          (task) => task.id!.toString() === overId,
        ),
    );

    if (!targetColumn) return;

    // ✅ Find source column
    const sourceColumn = workflow?.states.find((state) =>
      tasks[state.id!.toString()]?.some(
        (task) => task.id!.toString() === activeId,
      ),
    );

    if (!sourceColumn || sourceColumn.id === targetColumn.id) return;

    // ✅ Get moved task
    const movedTask = tasks[sourceColumn.id!.toString()]?.find(
      (task) => task.id!.toString() === activeId,
    );

    if (!movedTask) return;

    await updateTeamRequestState(movedTask.id!, targetColumn.id!, setError);

    // ✅ Update local state
    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };

      // Remove task from source column
      updatedTasks[sourceColumn.id!.toString()] = updatedTasks[
        sourceColumn.id!.toString()
      ]?.filter((task) => task.id!.toString() !== activeId);

      // Add task to target column
      updatedTasks[targetColumn.id!.toString()] = [
        ...(updatedTasks[targetColumn.id!.toString()] || []),
        { ...movedTask, currentStateId: targetColumn.id! },
      ];

      return updatedTasks;
    });
  };

  const breadcrumbItems = [
    { title: "Dashboard", link: "/portal" },
    { title: "Teams", link: "/portal/teams" },
    { title: team.name, link: `/portal/teams/${obfuscate(team.id)}` },
    { title: "Projects", link: `/portal/teams/${obfuscate(team.id)}/projects` },
    { title: project?.name!, link: "#" },
  ];

  return (
    <div className="p-6 h-screen flex flex-col">
      {loading ? (
        <p className="text-lg font-semibold">Loading project...</p>
      ) : project ? (
        <>
          <Breadcrumbs items={breadcrumbItems} />
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
        {/* ✅ Full height scrollable container */}
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
                setSelectedWorkflowState={() => setSelectedWorkflowState(state)}
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
        selectedWorkflowState={selectedWorkflowState}
        setTasks={setTasks}
        teamId={project?.teamId!}
        projectId={projectId}
        projectWorkflowId={workflow?.id!}
      />
    </div>
  );
};

export default ProjectView;
