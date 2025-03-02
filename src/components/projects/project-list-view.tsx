"use client";

import { Loader, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { Heading } from "@/components/heading";
import NewProjectDialog from "@/components/projects/project-new-dialog";
import { TeamAvatar } from "@/components/shared/avatar-display";
import PaginationExt from "@/components/shared/pagination-ext";
import TeamNavLayout from "@/components/teams/team-nav";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
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
import { searchProjects } from "@/lib/actions/project.action";
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

  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(""); // Debounced value
  const [statusFilter, setStatusFilter] = useState("Active");
  const { setError } = useError();

  // Debounce search input (wait 300ms before updating debouncedSearch)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(handler); // Cleanup function
  }, [searchQuery]);

  const fetchProjects = async () => {
    setLoading(true);

    try {
      // Build filters dynamically
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

      const query: QueryDTO = {
        groups: [{ logicalOperator: "AND", filters }],
      };

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

  const onCreatedProjectSuccess = () => {
    fetchProjects(); // Refresh project list after new project creation
  };

  const handleEdit = (project: ProjectDTO) => {
    console.log("Edit project:", project);
    // TODO: Implement edit functionality
  };

  const handleDelete = (project: ProjectDTO) => {
    console.log("Delete project:", project);
    // TODO: Implement delete functionality
  };

  return (
    <BreadcrumbProvider items={breadcrumbItems}>
      <TeamNavLayout teamId={team.id!}>
        <div className="grid grid-cols-1 gap-4">
          {/* Header */}
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
                <Button onClick={() => setOpen(true)}>New Project</Button>
                <NewProjectDialog
                  open={open}
                  setOpen={setOpen}
                  teamEntity={team}
                  onSaveSuccess={onCreatedProjectSuccess}
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

          {/* Project List */}
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
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                href={`/portal/teams/${obfuscate(team.id)}/projects/${obfuscate(project.id)}`}
                                className="text-blue-500 hover:underline"
                              >
                                {project.name}
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html:
                                    project.description ||
                                    "No description available",
                                }}
                                className="text-sm text-gray-300"
                              />
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-md bg-blue-500 text-white text-xs">
                            {project.status}
                          </span>
                        </TableCell>
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
