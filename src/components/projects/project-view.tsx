"use client";

import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { ChevronDown, Edit, Plus } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import ProjectEditDialog from "@/components/projects/project-edit-dialog";
import CreateEpicDialog from "@/components/projects/project-epic-dialog";
import CreateIterationDialog from "@/components/projects/project-iteration-dialog";
import StateColumn from "@/components/projects/state-column";
import TaskBlock from "@/components/projects/task-block";
import TaskDetailSheet from "@/components/projects/task-detail-sheet";
import TaskEditorSheet, {
  TaskBoard,
} from "@/components/projects/task-editor-sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePagePermission } from "@/hooks/use-page-permission";
import {
  findProjectById,
  findProjectWorkflowByTeam,
} from "@/lib/actions/project.action";
import {
  searchTeamRequests,
  updateTeamRequest,
  updateTeamRequestState,
} from "@/lib/actions/teams-request.action";
import { calculateDuration } from "@/lib/datetime";
import { obfuscate } from "@/lib/endecode";
import { useError } from "@/providers/error-provider";
import { useTeam } from "@/providers/team-provider";
import { useUserTeamRole } from "@/providers/user-team-role-provider";
import { ProjectDTO } from "@/types/projects";
import { Pagination, QueryDTO } from "@/types/query";
import { PermissionUtils } from "@/types/resources";
import { TeamRequestDTO } from "@/types/team-requests";
import { WorkflowDetailDTO, WorkflowStateDTO } from "@/types/workflows";

// Function to generate a constant background color for workflow states.
const getColumnColor = (_: number): string => "bg-[hsl(var(--card))]";

// Type definitions for iteration and epic
interface IterationDTO {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: "Planned" | "In Progress" | "Completed";
  description?: string;
}

interface EpicDTO {
  id: number;
  name: string;
  description: string;
  color: string;
}

// Mock data for iterations and epics
const mockIterations: IterationDTO[] = [
  {
    id: 1,
    name: "Sprint 1",
    startDate: "2025-02-01",
    endDate: "2025-02-14",
    status: "Completed",
    description: "Initial feature implementation",
  },
  {
    id: 2,
    name: "Sprint 2",
    startDate: "2025-02-15",
    endDate: "2025-02-28",
    status: "In Progress",
    description: "UI refinement and bug fixes",
  },
  {
    id: 3,
    name: "Sprint 3",
    startDate: "2025-03-01",
    endDate: "2025-03-14",
    status: "Planned",
    description: "Performance optimization",
  },
];

const mockEpics: EpicDTO[] = [
  {
    id: 1,
    name: "User Authentication",
    description: "Implement secure login and registration",
    color: "#8884d8",
  },
  {
    id: 2,
    name: "Dashboard Redesign",
    description: "Update the UI for better user experience",
    color: "#82ca9d",
  },
  {
    id: 3,
    name: "API Integration",
    description: "Connect with third-party services",
    color: "#ffc658",
  },
];

// Mock task-iteration and task-epic relationships
const mockTaskIterationMap: Record<number, number> = {
  1: 2, // Task 1 belongs to Sprint 2
  2: 1, // Task 2 belongs to Sprint 1
  3: 3, // Task 3 belongs to Sprint 3
  4: 2, // Task 4 belongs to Sprint 2
  5: 1, // Task 5 belongs to Sprint 1
};

const mockTaskEpicMap: Record<number, number> = {
  1: 2, // Task 1 is part of Dashboard Redesign
  2: 1, // Task 2 is part of User Authentication
  3: 3, // Task 3 is part of API Integration
  4: 2, // Task 4 is part of Dashboard Redesign
  5: 1, // Task 5 is part of User Authentication
};

export const ProjectView = ({ projectId }: { projectId: number }) => {
  const team = useTeam();
  const permissionLevel = usePagePermission();
  const teamRole = useUserTeamRole().role;
  const [project, setProject] = useState<ProjectDTO | null>(null);
  const [workflow, setWorkflow] = useState<WorkflowDetailDTO | null>(null);
  const [tasks, setTasks] = useState<TaskBoard>({});
  const [loading, setLoading] = useState(true);
  const { setError } = useError();

  // State for iterations and epics
  const [iterations, setIterations] = useState<IterationDTO[]>(mockIterations);
  const [epics, setEpics] = useState<EpicDTO[]>(mockEpics);

  // State for filters
  const [selectedIteration, setSelectedIteration] = useState<number | null>(
    null,
  );
  const [selectedEpic, setSelectedEpic] = useState<number | null>(null);

  // State for dialogs
  const [isCreateIterationDialogOpen, setIsCreateIterationDialogOpen] =
    useState(false);
  const [isCreateEpicDialogOpen, setIsCreateEpicDialogOpen] = useState(false);

  // State for filtered tasks
  const [filteredTasks, setFilteredTasks] = useState<TaskBoard>({});

  // State for drag and click management.
  const [activeTask, setActiveTask] = useState<TeamRequestDTO | null>(null);
  // State for tracking the selected task and its detail view.
  const [selectedTask, setSelectedTask] = useState<TeamRequestDTO | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  // Track Add Task Sheet State.
  const [selectedWorkflowState, setSelectedWorkflowState] =
    useState<WorkflowStateDTO | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  // State for Project Edit Dialog visibility.
  const [isProjectEditDialogOpen, setIsProjectEditDialogOpen] = useState(false);
  // Track if dragging is in progress
  const [isDragging, setIsDragging] = useState(false);
  // Track the time when drag starts
  const [dragStartTime, setDragStartTime] = useState<number | null>(null);

  // Extracted fetchProjectData so we can use it on mount and after saving a project.
  const fetchProjectData = useCallback(async () => {
    setLoading(true);
    try {
      const projectData = await findProjectById(projectId, setError);
      setProject(projectData);

      // Fetch Workflow.
      const workflowData = await findProjectWorkflowByTeam(team.id!, setError);
      setWorkflow(workflowData);

      if (workflowData) {
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
            sort: [{ field: "id", direction: "desc" }],
          };

          const tasksData = await searchTeamRequests(
            query,
            pagination,
            setError,
          );
          allTasks = [...allTasks, ...tasksData.content];
          totalElements = tasksData.totalElements;
          currentPage++;
        } while (allTasks.length < totalElements);

        // Allocate tasks to columns based on workflow states.
        const newTasks: TaskBoard = {};
        workflowData.states.forEach((state) => {
          newTasks[state.id!.toString()] = allTasks.filter(
            (task) => task.currentStateId === state.id,
          );
        });

        setTasks(newTasks);
        setFilteredTasks(newTasks); // Initialize filtered tasks with all tasks
      }
    } finally {
      setLoading(false);
    }
  }, [projectId, team.id, setError]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  // Filter tasks based on selected iteration and epic
  useEffect(() => {
    if (!Object.keys(tasks).length) return;

    const newFilteredTasks: TaskBoard = {};

    // Deep copy of tasks to avoid reference issues
    Object.keys(tasks).forEach((stateId) => {
      // Filter tasks based on selected iteration and epic
      const filteredTasksForState = tasks[stateId].filter((task) => {
        const taskId = task.id!;
        const matchesIteration =
          selectedIteration === null ||
          mockTaskIterationMap[taskId] === selectedIteration;
        const matchesEpic =
          selectedEpic === null || mockTaskEpicMap[taskId] === selectedEpic;
        return matchesIteration && matchesEpic;
      });

      newFilteredTasks[stateId] = filteredTasksForState;
    });

    setFilteredTasks(newFilteredTasks);
  }, [tasks, selectedIteration, selectedEpic]);

  // Reset filters
  const handleClearFilters = () => {
    setSelectedIteration(null);
    setSelectedEpic(null);
  };

  // Handler for adding a new iteration
  const handleAddNewIteration = () => {
    setIsCreateIterationDialogOpen(true);
  };

  // Handler for saving a new iteration
  const handleSaveIteration = (values: any) => {
    // Create new iteration object with proper date formatting
    const newIteration: IterationDTO = {
      id: iterations.length + 1,
      name: values.name,
      // Convert Date objects to strings for the DTO
      startDate: values.startDate
        ? values.startDate.toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      endDate: values.endDate
        ? values.endDate.toISOString().split("T")[0]
        : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
      status: "Planned", // Default status
      description: values.description || "",
    };

    // Add to iterations array
    setIterations([...iterations, newIteration]);

    // Close the dialog
    setIsCreateIterationDialogOpen(false);
  };

  // Handler for adding a new epic
  const handleAddNewEpic = () => {
    setIsCreateEpicDialogOpen(true);
  };

  // Handler for saving a new epic
  const handleSaveEpic = (values: any) => {
    // Create new epic object with proper formatting
    const newEpic: EpicDTO = {
      id: epics.length + 1,
      name: values.name,
      description: values.description || "",
      // Generate a random color on the front-end
      color: `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}`,
      // Store any additional fields from form values as needed
      // In a real implementation, this would be handled by your API
    };

    // Add to epics array
    setEpics([...epics, newEpic]);

    // Close the dialog
    setIsCreateEpicDialogOpen(false);
  };

  // Handler for updating task details, including state changes
  const handleTaskUpdate = async (updatedTask: TeamRequestDTO) => {
    if (!updatedTask.id) return;

    try {
      // Check if state has changed
      const oldTask = Object.values(tasks)
        .flat()
        .find((t) => t.id === updatedTask.id);

      const stateChanged =
        oldTask && oldTask.currentStateId !== updatedTask.currentStateId;

      // If state has changed, we need to move the task between columns
      if (stateChanged) {
        setTasks((prevTasks) => {
          const newTasks = { ...prevTasks };

          // Remove the task from its current column
          const oldStateId = oldTask?.currentStateId?.toString();
          if (oldStateId && newTasks[oldStateId]) {
            newTasks[oldStateId] = newTasks[oldStateId].filter(
              (task) => task.id !== updatedTask.id,
            );
          }

          // Add the task to its new column
          const newStateId = updatedTask.currentStateId?.toString();
          if (newStateId) {
            if (!newTasks[newStateId]) {
              newTasks[newStateId] = [];
            }
            newTasks[newStateId] = [...newTasks[newStateId], updatedTask];
          }

          return newTasks;
        });
      } else {
        // If state hasn't changed, update the task in its current column
        setTasks((prevTasks) => {
          const newTasks = { ...prevTasks };

          // Find which column contains the task
          Object.keys(newTasks).forEach((columnId) => {
            const columnTasks = newTasks[columnId];
            const taskIndex = columnTasks.findIndex(
              (task) => task.id === updatedTask.id,
            );

            if (taskIndex !== -1) {
              // Update the task in the column
              newTasks[columnId] = [
                ...columnTasks.slice(0, taskIndex),
                updatedTask,
                ...columnTasks.slice(taskIndex + 1),
              ];
            }
          });

          return newTasks;
        });
      }

      // Also update the selected task if it's the one being edited
      if (selectedTask?.id === updatedTask.id) {
        setSelectedTask(updatedTask);
      }

      // Add current date as modifiedDate
      const taskWithModifiedDate = {
        ...updatedTask,
        modifiedAt: new Date(),
      };

      // Then call the API to update on the server
      await updateTeamRequest(
        taskWithModifiedDate.id!,
        taskWithModifiedDate,
        setError,
      );
    } catch (error) {
      console.error("Failed to update task:", error);
      // If something goes wrong, re-fetch all data to sync with server
      fetchProjectData();
    }
  };

  // Improved dragStart
  const handleDragStart = (event: DragStartEvent) => {
    const activeId = event.active.id.toString();

    // Set dragging state
    setIsDragging(true);
    // Record drag start time
    setDragStartTime(Date.now());

    // Find the task being dragged
    let foundTask: TeamRequestDTO | null = null;
    Object.keys(filteredTasks).forEach((columnId) => {
      const task = filteredTasks[columnId].find(
        (task) => task.id?.toString() === activeId,
      );
      if (task) {
        foundTask = task;
      }
    });

    if (foundTask) {
      setActiveTask(foundTask);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    // Reset task state
    setActiveTask(null);

    // Calculate drag duration
    const dragDuration = dragStartTime ? Date.now() - dragStartTime : 0;

    // Reset drag tracking state
    setIsDragging(false);
    setDragStartTime(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    // Check if dragging over a column or a task inside a column.
    const targetColumn = workflow?.states.find(
      (state) =>
        state.id!.toString() === overId ||
        filteredTasks[state.id!.toString()]?.some(
          (task) => task.id!.toString() === overId,
        ),
    );

    if (!targetColumn) return;

    // Find source column.
    const sourceColumn = workflow?.states.find((state) =>
      filteredTasks[state.id!.toString()]?.some(
        (task) => task.id!.toString() === activeId,
      ),
    );

    if (!sourceColumn || sourceColumn.id === targetColumn.id) {
      // If drag was very short and in the same column, treat as a click
      if (dragDuration < 200 && sourceColumn) {
        // Find the task
        const clickedTask = filteredTasks[sourceColumn.id!.toString()]?.find(
          (task) => task.id!.toString() === activeId,
        );

        if (clickedTask) {
          // Handle as a click
          setSelectedTask(clickedTask);
          setIsTaskDetailOpen(true);
        }
      }
      return;
    }

    // Get moved task.
    const movedTask = filteredTasks[sourceColumn.id!.toString()]?.find(
      (task) => task.id!.toString() === activeId,
    );

    if (!movedTask) return;

    // Update task state on the server
    await updateTeamRequestState(movedTask.id!, targetColumn.id!, setError);

    // Create updated task with new state information
    const updatedTask = {
      ...movedTask,
      currentStateId: targetColumn.id!,
      currentStateName: targetColumn.stateName,
      modifiedAt: new Date(),
    };

    // Update both tasks and filteredTasks state
    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };

      // Remove task from source column
      updatedTasks[sourceColumn.id!.toString()] = updatedTasks[
        sourceColumn.id!.toString()
      ]?.filter((task) => task.id!.toString() !== activeId);

      // Add task to target column
      updatedTasks[targetColumn.id!.toString()] = [
        ...(updatedTasks[targetColumn.id!.toString()] || []),
        updatedTask,
      ];

      return updatedTasks;
    });

    // Also update filtered tasks directly for immediate UI feedback
    setFilteredTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };

      // Remove task from source column
      updatedTasks[sourceColumn.id!.toString()] = updatedTasks[
        sourceColumn.id!.toString()
      ]?.filter((task) => task.id!.toString() !== activeId);

      // Add task to target column
      updatedTasks[targetColumn.id!.toString()] = [
        ...(updatedTasks[targetColumn.id!.toString()] || []),
        updatedTask,
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
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            {(PermissionUtils.canWrite(permissionLevel) ||
              teamRole === "Manager") && (
              <Button
                onClick={() => setIsProjectEditDialogOpen(true)}
                variant="default"
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit project
              </Button>
            )}
          </div>

          <div
            className="text-gray-600 dark:text-gray-300 text-sm mb-4"
            dangerouslySetInnerHTML={{ __html: project.description ?? "" }}
          />

          <div className="flex flex-wrap items-center gap-4 mb-6">
            {project.status && (
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">
                  Status:
                </span>
                <Badge variant="default">{project.status}</Badge>
              </div>
            )}

            {project.startDate && (
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">
                  Start:
                </span>
                <span className="text-sm">
                  {new Date(project.startDate).toLocaleDateString()}
                </span>
              </div>
            )}

            {project.endDate && (
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">
                  End:
                </span>
                <span className="text-sm">
                  {new Date(project.endDate).toLocaleDateString()}
                </span>
              </div>
            )}

            {project.startDate && project.endDate && (
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">
                  Duration:
                </span>
                <span className="text-sm">
                  {calculateDuration(project.startDate, project.endDate)}
                </span>
              </div>
            )}
          </div>

          {/* Epic and Iteration Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-4 p-3 bg-muted rounded-md">
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">Iteration:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    {selectedIteration
                      ? iterations.find((i) => i.id === selectedIteration)?.name
                      : "All Iterations"}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem
                    onClick={() => setSelectedIteration(null)}
                    className="cursor-pointer"
                  >
                    All Iterations
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {iterations.map((iteration) => (
                    <DropdownMenuItem
                      key={iteration.id}
                      onClick={() => setSelectedIteration(iteration.id)}
                      className="cursor-pointer"
                    >
                      <div>
                        <div>{iteration.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {iteration.status} |{" "}
                          {new Date(iteration.startDate).toLocaleDateString()} -{" "}
                          {new Date(iteration.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleAddNewIteration}
                    className="cursor-pointer text-primary"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Iteration
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">Epic:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    {selectedEpic
                      ? epics.find((e) => e.id === selectedEpic)?.name
                      : "All Epics"}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem
                    onClick={() => setSelectedEpic(null)}
                    className="cursor-pointer"
                  >
                    All Epics
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {epics.map((epic) => (
                    <DropdownMenuItem
                      key={epic.id}
                      onClick={() => setSelectedEpic(epic.id)}
                      className="cursor-pointer"
                      style={{ borderLeft: `4px solid ${epic.color}` }}
                    >
                      <div>
                        <div>{epic.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {epic.description}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleAddNewEpic}
                    className="cursor-pointer text-primary"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Epic
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {(selectedIteration !== null || selectedEpic !== null) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="ml-auto"
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Selected Filters Summary with Edit Options */}
          {(selectedIteration !== null || selectedEpic !== null) && (
            <div className="mb-4 p-3 border rounded-md bg-background">
              <h3 className="text-sm font-medium mb-2">Active Filters:</h3>
              <div className="space-y-3">
                {selectedIteration !== null && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-2 bg-secondary/20 rounded-md">
                    <div className="flex-1">
                      <div className="font-medium">
                        Iteration:{" "}
                        {
                          iterations.find((i) => i.id === selectedIteration)
                            ?.name
                        }
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(
                          iterations.find((i) => i.id === selectedIteration)
                            ?.startDate || "",
                        ).toLocaleDateString()}{" "}
                        -
                        {new Date(
                          iterations.find((i) => i.id === selectedIteration)
                            ?.endDate || "",
                        ).toLocaleDateString()}
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-8 gap-1 self-start"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Iteration
                    </Button>
                  </div>
                )}

                {selectedEpic !== null && (
                  <div
                    className="flex flex-col sm:flex-row sm:items-center gap-2 p-2 rounded-md"
                    style={{
                      backgroundColor: `${epics.find((e) => e.id === selectedEpic)?.color}20`,
                    }}
                  >
                    <div className="flex-1">
                      <div
                        className="font-medium"
                        style={{
                          color: epics.find((e) => e.id === selectedEpic)
                            ?.color,
                        }}
                      >
                        Epic: {epics.find((e) => e.id === selectedEpic)?.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {epics.find((e) => e.id === selectedEpic)?.description}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1 self-start"
                      style={{
                        borderColor: epics.find((e) => e.id === selectedEpic)
                          ?.color,
                        color: epics.find((e) => e.id === selectedEpic)?.color,
                      }}
                    >
                      <Edit className="h-4 w-4" />
                      Edit Epic
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-red-500">Project not found.</p>
      )}

      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Full height scrollable container with an extra div at the end */}
        <div
          className="flex flex-grow gap-4 pb-2"
          style={{
            overflowX: "scroll",
            scrollbarWidth: "thin", // For Firefox
            scrollbarGutter: "stable", // Reserves space for the scrollbar
            WebkitOverflowScrolling: "touch", // For iOS
            msOverflowStyle: "-ms-autohiding-scrollbar", // For IE/Edge
          }}
        >
          {workflow?.states
            .sort((a, b) => {
              if (a.isInitial && !b.isInitial) return -1;
              if (!a.isInitial && b.isInitial) return 1;
              if (a.isFinal && !b.isFinal) return 1;
              if (!a.isFinal && b.isFinal) return -1;
              return 0;
            })
            .map((state) => (
              <StateColumn
                key={state.id}
                workflowState={state}
                tasks={filteredTasks[state.id!.toString()] || []}
                setIsSheetOpen={setIsSheetOpen}
                setSelectedWorkflowState={() => setSelectedWorkflowState(state)}
                columnColor={getColumnColor(state.id!)}
              />
            ))}
          {/* Add an extra padding div that matches column width */}
          <div className="min-w-[28rem] flex-shrink-0 opacity-0 pointer-events-none">
            {/* This invisible column ensures there's enough space at the end */}
          </div>
        </div>

        <DragOverlay>
          {activeTask ? <TaskBlock task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>

      <TaskEditorSheet
        isOpen={isSheetOpen}
        setIsOpen={setIsSheetOpen}
        selectedWorkflowState={selectedWorkflowState}
        setTasks={setTasks}
        teamId={project?.teamId!}
        projectId={projectId}
        projectWorkflowId={workflow?.id!}
      />
      <TaskDetailSheet
        isOpen={isTaskDetailOpen}
        setIsOpen={setIsTaskDetailOpen}
        task={selectedTask}
        onTaskUpdate={handleTaskUpdate}
      />

      <ProjectEditDialog
        open={isProjectEditDialogOpen}
        setOpen={setIsProjectEditDialogOpen}
        teamEntity={team}
        project={project}
        onSaveSuccess={async () => {
          setIsProjectEditDialogOpen(false);
          await fetchProjectData();
        }}
      />

      {/* Create Iteration Dialog */}
      <CreateIterationDialog
        open={isCreateIterationDialogOpen}
        onOpenChange={setIsCreateIterationDialogOpen}
        onSave={handleSaveIteration}
        onCancel={() => setIsCreateIterationDialogOpen(false)}
        projectId={projectId}
      />

      {/* Create Epic Dialog */}
      <CreateEpicDialog
        open={isCreateEpicDialogOpen}
        onOpenChange={setIsCreateEpicDialogOpen}
        onSave={handleSaveEpic}
        onCancel={() => setIsCreateEpicDialogOpen(false)}
        projectId={projectId}
      />
    </div>
  );
};

export default ProjectView;
