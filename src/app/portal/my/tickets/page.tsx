"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import DynamicQueryBuilder from "@/components/my/ticket-query-component";
import PaginationExt from "@/components/shared/pagination-ext";
import TeamRequestsStatusView from "@/components/teams/team-requests-status";
import { searchTeamRequests } from "@/lib/actions/teams-request.action";
import { useError } from "@/providers/error-provider";
import { Pagination, QueryDTO } from "@/types/query";
import { TeamRequestDTO } from "@/types/team-requests";

const Page = () => {
  const { data: session } = useSession();
  const { setError } = useError();

  // State for search query and pagination
  const [query, setQuery] = useState<QueryDTO | null>(null);
  const [requests, setRequests] = useState<TeamRequestDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    size: 10,
    sort: [{ field: "createdAt", direction: "desc" }],
  });

  // Handles search updates
  const handleSearch = (newQuery: QueryDTO) => {
    setQuery(newQuery);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to page 1 on new search
  };

  // Fetch tickets based on query and pagination
  const fetchTickets = async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      const combinedQuery: QueryDTO = {
        groups: [
          {
            logicalOperator: "AND",
            filters: [
              {
                field: "requestUser.id",
                operator: "eq",
                value: session.user.id,
              },
            ],
            groups: query?.groups || [],
          },
        ],
      };

      const pageResult = await searchTeamRequests(
        combinedQuery,
        pagination,
        setError,
      );

      setRequests(pageResult.content);
      setTotalElements(pageResult.totalElements);
      setTotalPages(pageResult.totalPages);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tickets when query, pagination, or sorting changes
  useEffect(() => {
    fetchTickets();
  }, [query, pagination]);

  return (
    <ContentLayout title="My Tickets">
      <h1 className="text-2xl mb-4">Dashboard</h1>

      {/* Responsive Layout */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Query Builder (Fixed Width, Prevent Shrinking) */}
        <div className="w-[500px] flex-none min-h-[250px] overflow-hidden">
          <DynamicQueryBuilder onSearch={handleSearch} />
        </div>

        {/* Tickets View & Pagination (Expands on Right) */}
        <div className="flex-1 flex flex-col space-y-4">
          <TeamRequestsStatusView requests={requests} />
          <PaginationExt
            currentPage={pagination.page}
            totalPages={totalPages}
            onPageChange={(page) =>
              setPagination((prev) => ({ ...prev, page }))
            }
          />
        </div>
      </div>
    </ContentLayout>
  );
};

export default Page;
