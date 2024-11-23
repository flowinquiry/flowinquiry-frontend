"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

import PaginationExt from "@/components/shared/pagination-ext";
import TruncatedHtmlLabel from "@/components/shared/truncate-html-label";
import TeamRequestDetailSheet from "@/components/teams/team-request-detail-sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ViewProps } from "@/components/ui/ext-form";
import { searchTeamRequests } from "@/lib/actions/teams-request.action";
import { formatDateTimeDistanceToNow } from "@/lib/datetime";
import { obfuscate } from "@/lib/endecode";
import { cn } from "@/lib/utils";
import { Filter, QueryDTO } from "@/types/query";
import { TeamRequestType, TeamType } from "@/types/teams";

interface TeamRequestsStatusViewProps extends ViewProps<TeamType> {
  query: QueryDTO;
}

const TeamRequestsStatusView = ({
  entity: team,
  query,
}: TeamRequestsStatusViewProps) => {
  const [requests, setRequests] = useState<TeamRequestType[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(0); // Total pages
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false); // Loading state

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
      });

      setRequests(pageResult.content);
      setTotalElements(pageResult.totalElements);
      setTotalPages(pageResult.totalPages);
    } finally {
      setLoading(false);
    }
  };

  const [selectedRequest, setSelectedRequest] =
    useState<TeamRequestType | null>(null);

  const openSheet = (request: TeamRequestType) => {
    setSelectedRequest(request);
  };

  const closeSheet = () => {
    setSelectedRequest(null);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, query]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        {requests.map((request, index) => (
          <div
            className={cn(
              "p-4 hover:bg-[hsl(var(--muted))] transition-colors",
              "odd:bg-[hsl(var(--card))] odd:text-[hsl(var(--card-foreground))]",
              "even:bg-[hsl(var(--secondary))] even:text-[hsl(var(--secondary-foreground))]",
              "border-t border-l border-r border-[hsl(var(--border))]",
              index === requests.length - 1 && "border-b", // Add bottom border for the last element
            )}
            key={request.id}
          >
            <Button
              variant="link"
              className="px-0 text-xl"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              {/* Created */}
              <div className="flex items-start gap-2">
                <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400 w-1/3 text-right leading-6">
                  Created
                </span>
                <div className="text-sm w-2/3 text-left">
                  {formatDateTimeDistanceToNow(new Date(request.createdDate!))}
                </div>
              </div>

              {/* Request User */}
              <div className="flex items-start gap-2">
                <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400 w-1/3 text-right leading-6">
                  Request User
                </span>
                <div className="w-2/3 text-left">
                  <Button variant="link" className="p-0 h-0">
                    <Link
                      href={`/portal/users/${obfuscate(request.requestUserId)}`}
                    >
                      {request.requestUserName}
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Assign User */}
              <div className="flex items-start gap-2">
                <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400 w-1/3 text-right leading-6">
                  Assign User
                </span>
                <div className="w-2/3 text-left">
                  {request.assignUserId ? (
                    <Button variant="link" className="p-0 h-0">
                      <Link
                        href={`/portal/users/${obfuscate(request.assignUserId)}`}
                      >
                        {request.assignUserName}
                      </Link>
                    </Button>
                  ) : (
                    <span className="text-sm text-gray-500">
                      No user assigned
                    </span>
                  )}
                </div>
              </div>

              {/* Current State */}
              <div className="flex items-start gap-2">
                <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400 w-1/3 text-right leading-6">
                  Current State
                </span>
                <div className="w-2/3 text-left">
                  <Badge>{request.currentState}</Badge>
                </div>
              </div>
            </div>
          </div>
        ))}

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
