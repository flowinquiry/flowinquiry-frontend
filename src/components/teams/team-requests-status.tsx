"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

import { UserAvatar } from "@/components/shared/avatar-display";
import { NColumnsGrid } from "@/components/shared/n-columns-grid";
import PaginationExt from "@/components/shared/pagination-ext";
import TruncatedHtmlLabel from "@/components/shared/truncate-html-label";
import TeamRequestDetailSheet from "@/components/teams/team-request-detail-sheet";
import { PriorityDisplay } from "@/components/teams/team-requests-priority-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ViewProps } from "@/components/ui/ext-form";
import { searchTeamRequests } from "@/lib/actions/teams-request.action";
import { formatDateTimeDistanceToNow } from "@/lib/datetime";
import { obfuscate } from "@/lib/endecode";
import { cn } from "@/lib/utils";
import { Filter, Pagination, QueryDTO } from "@/types/query";
import { TeamRequestDTO } from "@/types/team-requests";
import { TeamDTO } from "@/types/teams";

interface TeamRequestsStatusViewProps extends ViewProps<TeamDTO> {
  query: QueryDTO;
  pagination: Pagination;
  refreshTrigger: number; // Add refreshTrigger prop
}

const TeamRequestsStatusView = ({
  entity: team,
  query,
  pagination,
  refreshTrigger,
}: TeamRequestsStatusViewProps) => {
  const [requests, setRequests] = useState<TeamRequestDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const combinedFilters: Filter[] = [
        { field: "team.id", operator: "eq", value: team.id },
        ...(query.filters || []),
      ];

      const pageResult = await searchTeamRequests(combinedFilters, {
        page: currentPage,
        size: 10,
        sort: pagination.sort,
      });

      setRequests(pageResult.content);
      setTotalElements(pageResult.totalElements);
      setTotalPages(pageResult.totalPages);
    } finally {
      setLoading(false);
    }
  };

  const [selectedRequest, setSelectedRequest] = useState<TeamRequestDTO | null>(
    null,
  );

  const openSheet = (request: TeamRequestDTO) => {
    setSelectedRequest(request);
  };

  const closeSheet = () => {
    setSelectedRequest(null);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, query, refreshTrigger]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        {requests.map((request, index) => {
          const currentDate = new Date();
          const estimatedCompletionDate = request.estimatedCompletionDate
            ? new Date(request.estimatedCompletionDate)
            : null;

          const isOverdue =
            estimatedCompletionDate && estimatedCompletionDate < currentDate;

          const isCloseToDeadline =
            estimatedCompletionDate &&
            estimatedCompletionDate >= currentDate &&
            (estimatedCompletionDate.getTime() - currentDate.getTime()) /
              (1000 * 60 * 60 * 24) <=
              1; // Less than or equal to 1 day left

          return (
            <div
              className={cn(
                "relative p-4 hover:bg-[hsl(var(--muted))] transition-colors",
                "odd:bg-[hsl(var(--card))] odd:text-[hsl(var(--card-foreground))]",
                "even:bg-[hsl(var(--secondary))] even:text-[hsl(var(--secondary-foreground))]",
                "border-t border-l border-r border-[hsl(var(--border))]",
                index === requests.length - 1 && "border-b",
              )}
              key={request.id}
            >
              {/* Ribbon for Overdue or Close-to-Deadline */}
              {isOverdue && (
                <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-bl-md dark:bg-red-800">
                  Overdue
                </div>
              )}
              {isCloseToDeadline && !isOverdue && (
                <div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-bl-md dark:bg-yellow-600 dark:text-black">
                  1 Day Left
                </div>
              )}

              <Button
                variant="link"
                className="px-0 text-xl text-left break-words whitespace-normal pb-4"
                onClick={() => openSheet(request)}
                tabIndex={0}
                role="button"
                aria-label={`Open details for ${request.requestTitle}`}
              >
                {request.requestTitle}
              </Button>

              <TruncatedHtmlLabel
                htmlContent={request.requestDescription!}
                wordLimit={400}
              />

              {/* Grid Content */}
              <NColumnsGrid
                columns={2}
                gap="4"
                fields={[
                  {
                    label: "Created",
                    value: formatDateTimeDistanceToNow(
                      new Date(request.createdAt!),
                    ),
                    colSpan: 1,
                  },
                  {
                    label: "Modified",
                    value: formatDateTimeDistanceToNow(
                      new Date(request.modifiedAt!),
                    ),
                    colSpan: 1,
                  },

                  {
                    label: "Request User",
                    value: (
                      <div className="flex items-center gap-2">
                        <UserAvatar
                          imageUrl={request.requestUserImageUrl}
                          size="w-6 h-6"
                        />
                        <Button variant="link" className="p-0 h-auto">
                          <Link
                            href={`/portal/users/${obfuscate(request.requestUserId)}`}
                          >
                            {request.requestUserName}
                          </Link>
                        </Button>
                      </div>
                    ),
                    colSpan: 1,
                  },
                  {
                    label: "Assign User",
                    value: request.assignUserId ? (
                      <div className="flex items-center gap-2">
                        <UserAvatar
                          imageUrl={request.assignUserImageUrl}
                          size="w-6 h-6"
                        />
                        <Button variant="link" className="p-0 h-auto">
                          <Link
                            href={`/portal/users/${obfuscate(request.assignUserId)}`}
                          >
                            {request.assignUserName}
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <span className="text-gray-500">No user assigned</span>
                    ),
                    colSpan: 1,
                  },
                  {
                    label: "Type",
                    value: (
                      <Badge variant="outline">
                        {request.workflowRequestName}
                      </Badge>
                    ),
                    colSpan: 1,
                  },
                  {
                    label: "Priority",
                    value: <PriorityDisplay priority={request.priority} />,
                    colSpan: 1,
                  },
                  {
                    label: "State",
                    value: (
                      <Badge variant="outline">
                        {request.currentStateName}
                      </Badge>
                    ),
                    colSpan: 1,
                  },
                  {
                    label: "Channel",
                    value: request.channel && (
                      <Badge variant="outline">{request.channel}</Badge>
                    ),
                    colSpan: 1,
                  },
                  {
                    label: "Target Completion Date",
                    value: request.estimatedCompletionDate
                      ? new Date(request.estimatedCompletionDate).toDateString()
                      : "N/A",
                    colSpan: 1,
                  },
                  {
                    label: "Actual Completion Date",
                    value: request.actualCompletionDate
                      ? new Date(request.actualCompletionDate).toDateString()
                      : "N/A",
                    colSpan: 1,
                  },
                ]}
              />
            </div>
          );
        })}

        {selectedRequest && (
          <TeamRequestDetailSheet
            open={!!selectedRequest}
            onClose={closeSheet}
            request={selectedRequest}
          />
        )}
      </div>

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

export default TeamRequestsStatusView;
