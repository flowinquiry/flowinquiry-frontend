"use client";

import { CaretDownIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { Heading } from "@/components/heading";
import { TeamAvatar } from "@/components/shared/avatar-display";
import LoadingPlaceHolder from "@/components/shared/loading-place-holder";
import PaginationExt from "@/components/shared/pagination-ext";
import TeamNavLayout from "@/components/teams/team-nav";
import NewRequestToTeamDialog from "@/components/teams/team-new-request-dialog";
import TeamRequestsStatusView from "@/components/teams/team-requests-status";
import TicketAdvancedSearch from "@/components/teams/ticket-advanced-search";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePagePermission } from "@/hooks/use-page-permission";
import { searchTeamRequests } from "@/lib/actions/teams-request.action";
import { getWorkflowsByTeam } from "@/lib/actions/workflows.action";
import { obfuscate } from "@/lib/endecode";
import { BreadcrumbProvider } from "@/providers/breadcrumb-provider";
import { useError } from "@/providers/error-provider";
import { useTeam } from "@/providers/team-provider";
import { useUserTeamRole } from "@/providers/user-team-role-provider";
import { QueryDTO } from "@/types/query";
import { PermissionUtils } from "@/types/resources";
import { TeamRequestDTO } from "@/types/team-requests";
import { WorkflowDTO } from "@/types/workflows";

export type Pagination = {
  page: number;
  size: number;
  sort?: { field: string; direction: "asc" | "desc" }[];
};

const TicketListView = () => {
  const team = useTeam();
  const breadcrumbItems = [
    { title: "Dashboard", link: "/portal" },
    { title: "Teams", link: "/portal/teams" },
    { title: team.name, link: `/portal/teams/${obfuscate(team.id)}` },
    { title: "Tickets", link: "#" },
  ];

  const permissionLevel = usePagePermission();
  const teamRole = useUserTeamRole().role;

  const [open, setOpen] = useState(false);

  // Basic state management
  const [searchText, setSearchText] = useState("");
  const [isAscending, setIsAscending] = useState(false);
  const [workflows, setWorkflows] = useState<WorkflowDTO[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowDTO | null>(
    null,
  );
  const [requests, setRequests] = useState<TeamRequestDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [statuses, setStatuses] = useState<string[]>(["New", "Assigned"]);
  const { setError } = useError();

  // Enhanced state for advanced search
  const [fullQuery, setFullQuery] = useState<QueryDTO | null>(null);

  // Pagination state
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    size: 10,
    sort: [
      {
        field: "createdAt",
        direction: isAscending ? "asc" : "desc",
      },
    ],
  });

  // Update sort direction when isAscending changes
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      sort: [
        {
          field: "createdAt",
          direction: isAscending ? "asc" : "desc",
        },
      ],
    }));
  }, [isAscending]);

  // Fetch team workflows
  useEffect(() => {
    const fetchWorkflows = () => {
      getWorkflowsByTeam(team.id!, false, setError).then((data) =>
        setWorkflows(data),
      );
    };
    fetchWorkflows();
  }, [team.id]);

  // Handle filter changes from TicketAdvancedSearch
  const handleFilterChange = (query: QueryDTO) => {
    setFullQuery(query);
    setCurrentPage(1);
  };

  // Fetch tickets with the full query
  const fetchTickets = async () => {
    setLoading(true);

    try {
      if (!fullQuery) {
        setRequests([]);
        setTotalElements(0);
        setTotalPages(0);
        return;
      }

      // Create a combined query that includes team ID filter
      const combinedQuery: QueryDTO = {
        groups: [
          {
            logicalOperator: "AND",
            filters: [
              { field: "team.id", operator: "eq", value: team.id! },
              { field: "project", operator: "eq", value: null },
            ],
            groups: fullQuery.groups || [],
          },
        ],
      };

      const pageResult = await searchTeamRequests(
        combinedQuery,
        {
          page: currentPage,
          size: 10,
          sort: pagination.sort,
        },
        setError,
      );

      setRequests(pageResult.content);
      setTotalElements(pageResult.totalElements);
      setTotalPages(pageResult.totalPages);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tickets when query parameters change
  useEffect(() => {
    fetchTickets();
  }, [fullQuery, currentPage, pagination.sort]);

  // Handle successful ticket creation
  const onCreatedTeamRequestSuccess = () => {
    fetchTickets();
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
                title={`Tickets (${totalElements})`}
                description="Monitor and handle your team's tickets. Stay on top of assignments and progress."
              />
            </div>
            {(PermissionUtils.canWrite(permissionLevel) ||
              teamRole === "Manager" ||
              teamRole === "Member" ||
              teamRole === "Guest") && (
              <div>
                <div className="flex items-center">
                  <Button className={"rounded-r-none"}>New</Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className={
                          "rounded-l-none border-l-2 border-l-current px-2"
                        }
                      >
                        <CaretDownIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    {Array.isArray(workflows) && workflows.length > 0 ? (
                      <DropdownMenuContent>
                        {workflows.map((workflow) => (
                          <DropdownMenuItem
                            key={workflow.id}
                            className="cursor-pointer"
                            onClick={() => {
                              setSelectedWorkflow(workflow);
                              setOpen(true);
                            }}
                          >
                            {workflow.requestName}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    ) : (
                      <DropdownMenuContent>
                        No workflow is available for team.{" "}
                        {PermissionUtils.canWrite(permissionLevel) ||
                        teamRole === "Manager" ? (
                          <span>
                            You can create a new workflow at{" "}
                            <Button variant="link" className="px-0">
                              {" "}
                              <Link
                                href={`/portal/teams/${obfuscate(team.id)}/workflows`}
                              >
                                here
                              </Link>
                            </Button>
                            .
                          </span>
                        ) : (
                          <span>
                            Contact the team manager to create a new workflow.
                          </span>
                        )}
                      </DropdownMenuContent>
                    )}
                  </DropdownMenu>
                </div>
                <NewRequestToTeamDialog
                  open={open}
                  setOpen={setOpen}
                  teamEntity={team}
                  workflow={selectedWorkflow!}
                  onSaveSuccess={onCreatedTeamRequestSuccess}
                />
              </div>
            )}
          </div>

          <TicketAdvancedSearch
            searchText={searchText}
            setSearchText={setSearchText}
            statuses={statuses}
            setStatuses={setStatuses}
            isAscending={isAscending}
            setIsAscending={setIsAscending}
            onFilterChange={handleFilterChange}
          />

          {loading ? (
            <div className="flex justify-center py-4">
              <LoadingPlaceHolder message="Loading tickets ..." />
            </div>
          ) : (
            <>
              <TeamRequestsStatusView requests={requests} />
              <PaginationExt
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                }}
              />
            </>
          )}
        </div>
      </TeamNavLayout>
    </BreadcrumbProvider>
  );
};

export default TicketListView;
