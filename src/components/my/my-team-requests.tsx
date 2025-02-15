"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

import DynamicQueryBuilder from "@/components/my/ticket-query-component";
import PaginationExt from "@/components/shared/pagination-ext";
import TeamRequestsStatusView from "@/components/teams/team-requests-status";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { searchTeamRequests } from "@/lib/actions/teams-request.action";
import { useError } from "@/providers/error-provider";
import { Filter, Operator, Pagination, QueryDTO } from "@/types/query";
import { TeamRequestDTO } from "@/types/team-requests";

const validTicketTypes = ["reported", "assigned"] as const;
type TicketType = (typeof validTicketTypes)[number];

const MyTeamRequestsView = () => {
  const { data: session } = useSession();
  const { setError } = useError();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read ticket type from URL
  const ticketTypeParam = searchParams.get("ticketType") as TicketType;
  const [ticketType, setTicketType] = useState<TicketType>(
    validTicketTypes.includes(ticketTypeParam) ? ticketTypeParam : "reported",
  );

  // Watch for changes in search params and update state
  useEffect(() => {
    if (validTicketTypes.includes(ticketTypeParam)) {
      setTicketType(ticketTypeParam);
    } else {
      setTicketType("reported"); // Default if invalid
    }
  }, [ticketTypeParam]);

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
      // Inject appropriate user filter based on ticket type selection
      const userFilter: Filter = {
        field: ticketType === "reported" ? "requestUser.id" : "assignUser.id",
        operator: "eq" as Operator, // Ensure correct type
        value: session.user.id,
      };

      const combinedQuery: QueryDTO = {
        groups: [
          {
            logicalOperator: "AND",
            filters: [userFilter], // Inject user filter dynamically
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
  }, [query, pagination, ticketType]); // Update when ticketType changes

  // Handle ticket type change and update URL param
  const handleTicketTypeChange = (newType: TicketType) => {
    if (newType !== ticketType) {
      setTicketType(newType);
      router.push(`?ticketType=${newType}`, { scroll: false });
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">
          {ticketType === "reported"
            ? "My Reported Tickets"
            : "My Assigned Tickets"}
        </h1>
        <ToggleGroup
          type="single"
          value={ticketType}
          onValueChange={(value) => {
            if (value) handleTicketTypeChange(value as TicketType);
          }}
        >
          <ToggleGroupItem value="reported">Reported</ToggleGroupItem>
          <ToggleGroupItem value="assigned">Assigned</ToggleGroupItem>
        </ToggleGroup>
      </div>

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
    </>
  );
};

export default MyTeamRequestsView;
