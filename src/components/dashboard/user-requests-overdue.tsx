"use client";

import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

import { UserAvatar } from "@/components/shared/avatar-display";
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
import { getOverdueTicketsByUser } from "@/lib/actions/teams-request.action";
import { formatDateTimeDistanceToNow } from "@/lib/datetime";
import { obfuscate } from "@/lib/endecode";
import { TeamRequestDTO, TeamRequestPriority } from "@/types/team-requests";
import { useError } from "@/providers/error-provider";

const UserTeamsOverdueTickets = () => {
  const { data: session } = useSession();
  const userId = Number(session?.user?.id!);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalTickets, setTotalTickets] = useState<number>(0);
  const [tickets, setTickets] = useState<TeamRequestDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false); // State for collapsible content

  const [sortBy, setSortBy] = useState("priority");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { setError } = useError();

  useEffect(() => {
    const fetchOverdueTickets = async () => {
      setLoading(true);
      getOverdueTicketsByUser(
        userId,
        currentPage,
        sortBy,
        sortDirection,
        setError,
      )
        .then((data) => {
          setTickets(data.content);
          setTotalPages(data.totalPages);
          setTotalTickets(data.totalElements);
        })
        .finally(() => setLoading(false));
    };

    fetchOverdueTickets();
  }, [userId, currentPage, sortBy, sortDirection]);

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <Card>
      {/* Header Row */}
      <CardHeader>
        <div className="flex items-center justify-between">
          {/* Left: Chevron Icon and Title */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="flex items-center p-0"
            >
              {collapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            <CardTitle>Overdue Tickets ({totalTickets})</CardTitle>
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
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
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
          {loading ? (
            <div className="flex justify-center items-center h-[200px]">
              <Spinner className="h-8 w-8">
                <span>Loading data ...</span>
              </Spinner>
            </div>
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
                      <Button variant="link" className="px-0 h-auto">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              href={`/portal/teams/${obfuscate(
                                ticket.teamId,
                              )}/requests/${obfuscate(ticket.id)}`}
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
                      <div className="ml-4 text-sm">
                        <PriorityDisplay
                          priority={ticket.priority as TeamRequestPriority}
                        />
                      </div>
                    </div>
                    <TruncatedHtmlLabel
                      htmlContent={ticket.requestDescription!}
                      wordLimit={100}
                    />
                    <div className="flex items-center space-x-2">
                      <span>Assignee:</span>
                      {ticket.assignUserId ? (
                        <>
                          <UserAvatar
                            imageUrl={ticket.assignUserImageUrl}
                            size="w-6 h-6"
                          />
                          <Button variant="link" className="px-0 h-auto">
                            <Link
                              href={`/portal/users/${obfuscate(
                                ticket.assignUserId,
                              )}`}
                            >
                              {ticket.assignUserName}
                            </Link>
                          </Button>
                        </>
                      ) : (
                        <span className="text-gray-500">Unassigned</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Modified at:{" "}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-pointer">
                            {formatDateTimeDistanceToNow(ticket.modifiedAt)}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          {new Date(ticket.modifiedAt!).toLocaleString()}{" "}
                        </TooltipContent>
                      </Tooltip>
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No overdue tickets available
                </p>
              )}
            </div>
          )}

          <PaginationExt
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            className="pt-2"
          />
        </CardContent>
      )}
    </Card>
  );
};

export default UserTeamsOverdueTickets;
