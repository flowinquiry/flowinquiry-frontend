"use client";

import {
  ArrowDown,
  ArrowUp,
  CheckCircle,
  Clock,
  Plus,
  UserCheck,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import { Heading } from "@/components/heading";
import NewRequestToTeamDialog from "@/components/teams/team-new-request-dialog";
import TeamRequestsStatusView from "@/components/teams/team-requests-status";
import { Button } from "@/components/ui/button";
import { ViewProps } from "@/components/ui/ext-form";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePagePermission } from "@/hooks/use-page-permission";
import { useUserTeamRole } from "@/providers/user-team-role-provider";
import { Filter, QueryDTO } from "@/types/query";
import { PermissionUtils } from "@/types/resources";
import { TeamType } from "@/types/teams";

const TeamRequestsView = ({ entity: team }: ViewProps<TeamType>) => {
  const permissionLevel = usePagePermission();
  const teamRole = useUserTeamRole().role;

  const [open, setOpen] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [isAscending, setIsAscending] = useState(true);

  // Default to 'Open' as the selected status
  const [statuses, setStatuses] = useState<string[]>(["Open"]);

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
    const filters: Filter[] = [];

    // Add status filter
    if (statuses.length > 0) {
      filters.push({
        field: "status",
        operator: "in",
        value: statuses,
      });
    }

    // Add search text filter
    if (searchText.trim() !== "") {
      filters.push({
        field: "title", // Assuming you're searching by the 'title' field
        operator: "lk", // 'lk' for 'like'
        value: `%${searchText}%`, // SQL-style wildcard for 'LIKE'
      });
    }

    // Add sort order
    filters.push({
      field: "createdAt",
      operator: isAscending ? "gt" : "lt",
      value: null, // Sorting doesn't require a specific value
    });

    setQuery({ filters });
  }, [searchText, statuses, isAscending]);

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex flex-row justify-between">
        <div className="flex-shrink-0">
          <Heading title={`Requests`} description="Manage team requests" />
        </div>
        {(PermissionUtils.canWrite(permissionLevel) ||
          teamRole === "Manager" ||
          teamRole === "Member" ||
          teamRole === "Guest") && (
          <div>
            <Button onClick={() => setOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> New Request
            </Button>
            <NewRequestToTeamDialog
              open={open}
              setOpen={setOpen}
              teamEntity={team}
              onSaveSuccess={() => console.log("Save success")}
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
            { label: "Open", icon: Clock },
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
      {/* Pass query as props */}
      <TeamRequestsStatusView entity={team} query={query} />
    </div>
  );
};

export default TeamRequestsView;
