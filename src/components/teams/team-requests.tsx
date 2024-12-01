"use client";

import { CaretDownIcon } from "@radix-ui/react-icons";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle,
  Clock,
  UserCheck,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import { Heading } from "@/components/heading";
import { TeamAvatar } from "@/components/shared/avatar-display";
import PaginationExt from "@/components/shared/pagination-ext";
import NewRequestToTeamDialog from "@/components/teams/team-new-request-dialog";
import TeamRequestsStatusView from "@/components/teams/team-requests-status";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ViewProps } from "@/components/ui/ext-form";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePagePermission } from "@/hooks/use-page-permission";
import { searchTeamRequests } from "@/lib/actions/teams-request.action";
import { getWorkflowsByTeam } from "@/lib/actions/workflows.action";
import { useUserTeamRole } from "@/providers/user-team-role-provider";
import { Filter, GroupFilter, QueryDTO } from "@/types/query";
import { PermissionUtils } from "@/types/resources";
import { TeamRequestDTO } from "@/types/team-requests";
import { TeamDTO } from "@/types/teams";
import { WorkflowDTO } from "@/types/workflows";

export type Pagination = {
  page: number;
  size: number;
  sort?: { field: string; direction: "asc" | "desc" }[];
};

const TeamRequestsView = ({ entity: team }: ViewProps<TeamDTO>) => {
  const permissionLevel = usePagePermission();
  const teamRole = useUserTeamRole().role;

  const [open, setOpen] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState(""); // Debounced text
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

  const toggleStatus = (status: string) => {
    if (statuses.includes(status)) {
      if (statuses.length === 1) return;
      setStatuses(statuses.filter((s) => s !== status));
    } else {
      setStatuses([...statuses, status]);
    }
  };

  // Construct QueryDTO based on search parameters
  const [query, setQuery] = useState<QueryDTO>({ filters: [] });

  useEffect(() => {
    const groups: GroupFilter[] = [];

    // Status filters group
    const statusFilters: Filter[] = [];
    if (statuses.includes("New")) {
      statusFilters.push({
        field: "isNew",
        operator: "eq",
        value: true,
      });
    }
    if (statuses.includes("Completed")) {
      statusFilters.push({
        field: "isCompleted",
        operator: "eq",
        value: true,
      });
    }
    if (statuses.includes("Assigned")) {
      groups.push({
        logicalOperator: "AND", // Logical "AND" for the two conditions
        filters: [
          {
            field: "isCompleted",
            operator: "eq",
            value: false,
          },
          {
            field: "isNew",
            operator: "eq",
            value: false,
          },
        ],
      });
    }

    // If there are any status filters, add them as an OR group
    if (statusFilters.length > 0) {
      groups.push({
        filters: statusFilters,
        logicalOperator: "OR", // Logical "OR" for statuses
      });
    }

    // Search text filter
    if (debouncedSearchText.trim() !== "") {
      groups.push({
        filters: [
          {
            field: "requestTitle",
            operator: "lk", // 'lk' for 'like'
            value: `%${debouncedSearchText}%`,
          },
        ],
        logicalOperator: "AND", // Logical "AND" with other filters
      });
    }

    // Create the final query with groups
    const query: QueryDTO = {
      groups,
    };

    // Update the query and pagination sort
    setQuery(query);

    setPagination((prev) => ({
      ...prev,
      sort: [
        {
          field: "createdAt",
          direction: isAscending ? "asc" : "desc",
        },
      ],
    }));
  }, [debouncedSearchText, statuses, isAscending]);

  // Debounce logic to delay updates to `debouncedSearchText`
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText); // Update the debounced text after 3 seconds
    }, 3000);

    return () => clearTimeout(handler); // Cleanup the timeout if the input changes again
  }, [searchText]);

  useEffect(() => {
    const fetchWorkflows = () => {
      getWorkflowsByTeam(team.id!).then((data) => setWorkflows(data));
    };
    fetchWorkflows();
  }, [team.id]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      // Construct a new QueryDTO
      const combinedQuery: QueryDTO = {
        groups: [
          {
            logicalOperator: "AND",
            filters: [
              { field: "team.id", operator: "eq", value: team.id! }, // Add team filter
            ],
            groups: query.groups || [], // Include existing query groups
          },
        ],
      };

      // Pass QueryDTO to searchTeamRequests
      const pageResult = await searchTeamRequests(combinedQuery, {
        page: currentPage,
        size: 10,
        sort: pagination.sort,
      });

      // Update state with the results
      setRequests(pageResult.content);
      setTotalElements(pageResult.totalElements);
      setTotalPages(pageResult.totalPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [currentPage, query]);

  if (loading) return <div>Loading...</div>;

  const onCreatedTeamRequestSuccess = () => {
    fetchTickets();
  };

  return (
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
            title={`Team Tickets (${totalElements})`}
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
                {workflows ? (
                  <DropdownMenuContent>
                    {workflows.map((workflow) => (
                      <DropdownMenuItem
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
                    No workflow is available for team
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
      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md border border-gray-300 dark:border-gray-700">
        {/* Search Input */}
        <Input
          type="text"
          placeholder="Search tickets"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700"
        />

        {/* Toggle Ascending/Descending */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              pressed={isAscending}
              onPressedChange={setIsAscending}
              className="flex items-center justify-center p-2 border border-gray-300 dark:border-gray-700 rounded-md"
              aria-label="Sort Order"
            >
              {isAscending ? (
                <ArrowUp className="w-5 h-5" />
              ) : (
                <ArrowDown className="w-5 h-5" />
              )}
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Sort by Created Date ({isAscending ? "Ascending" : "Descending"})
            </p>
          </TooltipContent>
        </Tooltip>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          {[
            { label: "New", icon: Clock },
            { label: "Assigned", icon: UserCheck },
            { label: "Completed", icon: CheckCircle },
          ].map(({ label, icon: Icon }) => (
            <Tooltip key={label}>
              <TooltipTrigger asChild>
                <Button
                  variant={statuses.includes(label) ? "default" : "outline"}
                  className="p-2 flex items-center justify-center"
                  onClick={() => toggleStatus(label)}
                >
                  <Icon className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{`Filter by ${label} status`}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

      <TeamRequestsStatusView requests={requests} />
      <PaginationExt
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
        }}
      />
    </div>
  );
};

export default TeamRequestsView;
