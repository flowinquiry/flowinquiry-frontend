"use client";

import { Loader, MoreHorizontal, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { Heading } from "@/components/heading";
import ProjectEditDialog from "@/components/projects/project-edit-dialog";
import { TeamAvatar } from "@/components/shared/avatar-display";
import PaginationExt from "@/components/shared/pagination-ext";
import TeamNavLayout from "@/components/teams/team-nav";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePagePermission } from "@/hooks/use-page-permission";
import { deleteProject, searchProjects } from "@/lib/actions/project.action";
import { obfuscate } from "@/lib/endecode";
import { BreadcrumbProvider } from "@/providers/breadcrumb-provider";
import { useError } from "@/providers/error-provider";
import { useTeam } from "@/providers/team-provider";
import { useUserTeamRole } from "@/providers/user-team-role-provider";
import { ProjectDTO } from "@/types/projects";
import { Filter, QueryDTO } from "@/types/query";
import { PermissionUtils } from "@/types/resources";

const ProjectListView = () => {
  const team = useTeam();
  const breadcrumbItems = [
    { title: "Dashboard", link: "/portal" },
    { title: "Teams", link: "/portal/teams" },
    { title: team.name, link: `/portal/teams/${obfuscate(team.id)}` },
    { title: "Projects", link: "#" },
  ];

  const permissionLevel = usePagePermission();
  const teamRole = useUserTeamRole().role;

  const [openDialog, setOpenDialog] = useState(false);
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Active");
  const { setError } = useError();

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectDTO | null>(
    null,
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const filters: Filter[] = [
        { field: "team.id", operator: "eq", value: team.id! },
        { field: "status", operator: "eq", value: statusFilter },
      ];
      if (debouncedSearch.trim()) {
        filters.push({
          field: "name",
          operator: "lk",
          value: `%${debouncedSearch}%`,
        });
      }

      const query: QueryDTO = { groups: [{ logicalOperator: "AND", filters }] };
      const pageResult = await searchProjects(
        query,
        {
          page: currentPage,
          size: 10,
          sort: [{ field: "createdAt", direction: "desc" }],
        },
        setError,
      );

      setProjects(pageResult.content);
      setTotalElements(pageResult.totalElements);
      setTotalPages(pageResult.totalPages);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [currentPage, statusFilter, debouncedSearch]);

  const onCreatedOrUpdatedProjectSuccess = () => {
    fetchProjects();
  };

  const confirmDelete = (project: ProjectDTO) => {
    setSelectedProject(project);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedProject) return;
    await deleteProject(selectedProject.id!);
    setDeleteDialogOpen(false);
    fetchProjects();
  };

  return (
    <BreadcrumbProvider items={breadcrumbItems}>
      <TeamNavLayout teamId={team.id!}>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Tooltip>
                <TooltipTrigger>
                  <TeamAvatar imageUrl={team.logoUrl} size="w-20 h-20" />
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-left">
                    <p className="font-bold">{team.name}</p>
                    <p className="text-sm text-gray-500">
                      {team.slogan ?? "Stronger Together"}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
              <Heading
                title={`Projects (${totalElements})`}
                description="Manage and track your team's projects efficiently."
              />
            </div>
            {(PermissionUtils.canWrite(permissionLevel) ||
              teamRole === "Manager" ||
              teamRole === "Member") && (
              <div className="flex items-center">
                <Button
                  onClick={() => {
                    setSelectedProject(null);
                    setOpenDialog(true);
                  }}
                >
                  New Project
                </Button>
                <ProjectEditDialog
                  open={openDialog}
                  setOpen={setOpenDialog}
                  teamEntity={team}
                  project={selectedProject}
                  onSaveSuccess={onCreatedOrUpdatedProjectSuccess}
                />
              </div>
            )}
          </div>

          {/* Search & Status Filter Row */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md border border-gray-300 dark:border-gray-700">
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <ToggleGroup
              type="single"
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value)}
            >
              <ToggleGroupItem value="Active">Active</ToggleGroupItem>
              <ToggleGroupItem value="Closed">Closed</ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
            {loading ? (
              <Loader />
            ) : projects.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>
                          <Link
                            href={`/portal/teams/${obfuscate(team.id)}/projects/${obfuscate(project.id)}`}
                            className="text-blue-500 hover:underline"
                          >
                            {project.name}
                          </Link>
                        </TableCell>
                        <TableCell>{project.status}</TableCell>
                        <TableCell>
                          {project.startDate
                            ? new Date(project.startDate).toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {project.endDate
                            ? new Date(project.endDate).toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {project.createdAt
                            ? new Date(project.createdAt).toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-5 h-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedProject(project);
                                  setOpenDialog(true);
                                }}
                              >
                                <Pencil className="w-4 h-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => confirmDelete(project)}
                                className="text-red-600"
                              >
                                <Trash className="w-4 h-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <PaginationExt
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            ) : (
              <p className="text-gray-500 text-center">No projects found.</p>
            )}
          </div>
        </div>
      </TeamNavLayout>
    </BreadcrumbProvider>
  );
};

export default ProjectListView;
