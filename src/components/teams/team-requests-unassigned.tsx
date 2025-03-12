"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

import PaginationExt from "@/components/shared/pagination-ext";
import TruncatedHtmlLabel from "@/components/shared/truncate-html-label";
import { PriorityDisplay } from "@/components/teams/team-requests-priority-display";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getUnassignedTickets } from "@/lib/actions/teams-request.action";
import { formatDateTimeDistanceToNow } from "@/lib/datetime";
import { obfuscate } from "@/lib/endecode";
import { useError } from "@/providers/error-provider";
import { TeamRequestPriority } from "@/types/team-requests";

const UnassignedTickets = ({ teamId }: { teamId: number }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy] = useState("priority");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [collapsed, setCollapsed] = useState(false);
  const { setError } = useError();

  // Reset to page 1 when sort direction changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortDirection]);

  // **SWR Fetcher Function**
  const fetchTickets = async () => {
    return getUnassignedTickets(
      teamId,
      currentPage,
      sortBy,
      sortDirection,
      setError,
    );
  };

  // **Use SWR for Fetching with proper key**
  const { data, error, isLoading, mutate } = useSWR(
    [
      `/api/team/${teamId}/unassigned-tickets`,
      currentPage,
      sortBy,
      sortDirection,
    ],
    fetchTickets,
    {
      revalidateOnFocus: false,
    },
  );

  const tickets = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalTickets = data?.totalElements ?? 0;

  // **Safe Page Change Handler**
  const handlePageChange = (page: number) => {
    if (page < 1) page = 1;
    if (totalPages > 0 && page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  // **Toggle Sorting**
  const toggleSortDirection = () =>
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));

  return (
    <Card>
      {/* Header Row */}
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          {/* Left: Chevron Icon and Title */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="p-0"
            >
              {collapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </Button>
            <CardTitle className="text-left">
              Unassigned Tickets ({totalTickets})
            </CardTitle>
          </div>

          {/* Right: Sort Button */}
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={toggleSortDirection}
                  className="p-2 flex items-center gap-1"
                >
                  {sortDirection === "desc" ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <span className="text-sm">Priority</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {sortDirection === "asc"
                  ? "Sort by priority: Ascending"
                  : "Sort by priority: Descending"}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardHeader>

      {/* Collapsible Content */}
      {!collapsed && (
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-[200px]">
              <Spinner className="h-8 w-8">
                <span>Loading data ...</span>
              </Spinner>
            </div>
          ) : error ? (
            <p className="text-sm text-red-500">
              Failed to load tickets. Please try refreshing the page.
            </p>
          ) : (
            <div className="space-y-4">
              {tickets.length > 0 ? (
                tickets.map((ticket, index) => (
                  <div
                    key={ticket.id}
                    className={`py-4 px-4 rounded-md shadow-sm ${
                      index % 2 === 0
                        ? "bg-gray-50 dark:bg-gray-800"
                        : "bg-white dark:bg-gray-900"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <Button variant="link" className="px-0 h-auto">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link
                                  href={
                                    ticket.projectId && ticket.projectId > 0
                                      ? `/portal/teams/${obfuscate(ticket.teamId)}/projects/${obfuscate(ticket.projectId)}/${obfuscate(ticket.id)}`
                                      : `/portal/teams/${obfuscate(ticket.teamId)}/requests/${obfuscate(ticket.id)}`
                                  }
                                  className="truncate max-w-xs"
                                >
                                  {ticket.requestTitle}
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent>
                                <span>{ticket.requestTitle}</span>
                              </TooltipContent>
                            </Tooltip>
                          </Button>
                        </div>
                        {ticket.projectId !== undefined &&
                          ticket.projectName && (
                            <div className="mt-1 ml-4 flex items-center gap-2">
                              <span className="text-xs bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded">
                                Project
                              </span>
                              <Link
                                href={`/portal/teams/${obfuscate(ticket.teamId)}/projects/${obfuscate(ticket.projectId)}`}
                                className="text-xs font-medium text-blue-600 hover:underline"
                              >
                                {ticket.projectName}
                              </Link>
                            </div>
                          )}
                      </div>
                      <div className="flex flex-col items-end">
                        <PriorityDisplay
                          priority={ticket.priority as TeamRequestPriority}
                        />
                        {ticket.projectId === undefined && (
                          <span className="text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded mt-1">
                            Team
                          </span>
                        )}
                      </div>
                    </div>
                    <TruncatedHtmlLabel
                      htmlContent={ticket.requestDescription || ""}
                      wordLimit={100}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Modified at:{" "}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-pointer">
                            {ticket.modifiedAt
                              ? formatDateTimeDistanceToNow(ticket.modifiedAt)
                              : "N/A"}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          {ticket.modifiedAt
                            ? new Date(ticket.modifiedAt).toLocaleString()
                            : "N/A"}
                        </TooltipContent>
                      </Tooltip>
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No unassigned tickets available
                </p>
              )}
            </div>
          )}

          {totalPages > 0 && (
            <PaginationExt
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              className="pt-2"
            />
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default UnassignedTickets;
