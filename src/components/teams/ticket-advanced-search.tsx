"use client";

import {
  AlertTriangle,
  ArrowUpDown,
  CalendarIcon,
  CheckCircle,
  ChevronDown,
  Clock,
  FilterIcon,
  Inbox,
  Search,
  User,
  UserCheck,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, GroupFilter, QueryDTO } from "@/types/query";
import { TeamRequestPriority } from "@/types/team-requests";

// Type definitions
interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface PriorityConfig {
  [key: string]: {
    icon: React.ReactNode;
    color: string;
  };
}

interface StatusIcons {
  [key: string]: React.ReactNode;
}

interface TicketAdvancedSearchProps {
  searchText?: string;
  setSearchText: (text: string) => void;
  statuses?: string[];
  setStatuses: (statuses: string[]) => void;
  isAscending: boolean;
  setIsAscending: (isAscending: boolean) => void;
  onFilterChange?: (query: QueryDTO) => void;
}

// Utility function to join class names with conditional logic
const classNames = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

const priorityCodes: Record<TeamRequestPriority, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
  Trivial: 4,
};

const TicketAdvancedSearch: React.FC<TicketAdvancedSearchProps> = ({
  searchText = "",
  setSearchText,
  statuses = [],
  setStatuses,
  isAscending,
  setIsAscending,
  onFilterChange = () => {},
}) => {
  // Basic filters state
  const [priority, setPriority] = useState<string>("");
  const [assignee, setAssignee] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [activeFilterCount, setActiveFilterCount] = useState<number>(
    statuses?.length || 0,
  );

  const { data: session } = useSession();

  // Status icon mapping
  const statusIcons: StatusIcons = {
    New: <Clock className="h-4 w-4" />,
    Assigned: <UserCheck className="h-4 w-4" />,
    Completed: <CheckCircle className="h-4 w-4" />,
  };

  // Priority icons and colors
  const priorityConfig: PriorityConfig = {
    Critical: {
      icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    },
    High: {
      icon: <AlertTriangle className="h-4 w-4 text-orange-500" />,
      color:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    },
    Medium: {
      icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    },
    Low: {
      icon: <AlertTriangle className="h-4 w-4 text-blue-500" />,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    },
    Trivial: {
      icon: <AlertTriangle className="h-4 w-4 text-gray-500" />,
      color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    },
  };

  // Format date without external dependencies
  const formatDate = (date: Date | undefined): string => {
    if (!date) return "";
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  // Format date range for display
  const formatDateRange = (): string => {
    if (dateRange.from && dateRange.to) {
      return `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`;
    } else if (dateRange.from) {
      return `From ${formatDate(dateRange.from)}`;
    } else if (dateRange.to) {
      return `Until ${formatDate(dateRange.to)}`;
    }
    return "";
  };

  // Update count of active filters
  useEffect(() => {
    let count = 0;
    if (statuses?.length > 0) count += 1;
    if (priority !== "") count += 1;
    if (assignee !== "") count += 1;
    if (dateRange.from || dateRange.to) count += 1;

    setActiveFilterCount(count);

    // Call the filter change callback with all filter values
    buildQueryDTO();
  }, [statuses, priority, assignee, dateRange]);

  // Status toggle handler
  const toggleStatus = (status: string): void => {
    if (!statuses) {
      setStatuses([status]);
      return;
    }

    if (statuses.includes(status)) {
      if (statuses.length === 1) return;
      setStatuses(statuses.filter((s) => s !== status));
    } else {
      setStatuses([...statuses, status]);
    }
  };

  // Clear all filters
  const clearFilters = (): void => {
    setStatuses(["New", "Assigned"]);
    setPriority("");
    setAssignee("");
    setDateRange({ from: undefined, to: undefined });
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchText(e.target.value);
  };

  // Build QueryDTO from all filters
  const buildQueryDTO = (): QueryDTO => {
    const groups: GroupFilter[] = [];

    // Status filters
    if (statuses?.length > 0) {
      const statusFilters: Filter[] = [];
      const assignedGroupFilter: GroupFilter = {
        logicalOperator: "AND",
        filters: [
          { field: "isCompleted", operator: "eq", value: false },
          { field: "isNew", operator: "eq", value: false },
        ],
      };

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

      const statusGroup: GroupFilter = {
        filters: statusFilters,
        groups: statuses.includes("Assigned") ? [assignedGroupFilter] : [],
        logicalOperator: "OR",
      };

      groups.push(statusGroup);
    }

    // Priority filter
    if (priority !== "") {
      // Type assertion to ensure priority is a valid key
      const priorityKey = priority as TeamRequestPriority;
      if (priorityKey in priorityCodes) {
        groups.push({
          filters: [
            {
              field: "priority",
              operator: "eq",
              value: priorityCodes[priorityKey], // Correctly typed access
            },
          ],
          logicalOperator: "AND",
        });
      }
    }

    // Assignee filter
    if (assignee !== "") {
      if (assignee === "unassigned") {
        groups.push({
          filters: [
            {
              field: "assignUser.id",
              operator: "eq",
              value: null,
            },
          ],
          logicalOperator: "AND",
        });
      } else if (assignee === "me") {
        // Assuming there's a current user ID available
        // Would need to be passed in as a prop
        groups.push({
          filters: [
            {
              field: "assignUser.id",
              operator: "eq",
              value: session?.user?.id,
            },
          ],
          logicalOperator: "AND",
        });
      }
    }

    // Date range filter
    if (dateRange.from || dateRange.to) {
      const dateFilters: Filter[] = [];

      if (dateRange.from) {
        dateFilters.push({
          field: "createdAt",
          operator: "gt",
          value: dateRange.from.toISOString(),
        });
      }

      if (dateRange.to) {
        dateFilters.push({
          field: "createdAt",
          operator: "lt",
          value: dateRange.to.toISOString(),
        });
      }

      groups.push({
        filters: dateFilters,
        logicalOperator: "AND",
      });
    }

    // Search text filter
    if (searchText?.trim()) {
      groups.push({
        filters: [
          {
            field: "requestTitle",
            operator: "lk",
            value: `%${searchText}%`,
          },
        ],
        logicalOperator: "AND",
      });
    }

    const queryDTO: QueryDTO = {
      groups,
    };

    onFilterChange(queryDTO);
    return queryDTO;
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          {/* Search input with icon */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="text"
              placeholder="Search ticket title, description, or ID..."
              value={searchText}
              onChange={handleSearch}
              className="pl-10 w-full"
            />
          </div>

          <div className="flex md:flex-row gap-2">
            {/* Filter dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <FilterIcon className="h-4 w-4" />
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full"
                    >
                      {activeFilterCount}
                    </Badge>
                  )}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={statuses?.includes("New")}
                  onCheckedChange={() => toggleStatus("New")}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  New
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statuses?.includes("Assigned")}
                  onCheckedChange={() => toggleStatus("Assigned")}
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  Assigned
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statuses?.includes("Completed")}
                  onCheckedChange={() => toggleStatus("Completed")}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Completed
                </DropdownMenuCheckboxItem>

                <DropdownMenuSeparator />

                <DropdownMenuLabel>Priority</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={priority}
                  onValueChange={setPriority}
                >
                  <DropdownMenuRadioItem value="">
                    Any Priority
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Critical">
                    <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                    Critical
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="High">
                    <AlertTriangle className="mr-2 h-4 w-4 text-orange-500" />
                    High
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Medium">
                    <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                    Medium
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Low">
                    <AlertTriangle className="mr-2 h-4 w-4 text-blue-500" />
                    Low
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Trivial">
                    <AlertTriangle className="mr-2 h-4 w-4 text-gray-500" />
                    Trivial
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator />

                <DropdownMenuLabel>Assignee</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={assignee}
                  onValueChange={setAssignee}
                >
                  <DropdownMenuRadioItem value="">Anyone</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="me">
                    <User className="mr-2 h-4 w-4" />
                    Assigned to me
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="unassigned">
                    <Inbox className="mr-2 h-4 w-4" />
                    Unassigned
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator />

                <DropdownMenuLabel>Created Date</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={classNames(
                          "w-full justify-start text-left font-normal",
                          dateRange.from || dateRange.to ? "text-primary" : "",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from || dateRange.to ? (
                          formatDateRange()
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={{
                          from: dateRange.from,
                          to: dateRange.to,
                        }}
                        onSelect={(range) => {
                          setDateRange({
                            from: range?.from,
                            to: range?.to,
                          });
                        }}
                        initialFocus
                      />
                      <div className="flex items-center gap-2 p-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setDateRange({ from: undefined, to: undefined })
                          }
                          className="ml-auto"
                        >
                          Clear
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort dropdown as a separate control */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  <span>Sort</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup
                  value={isAscending ? "asc" : "desc"}
                  onValueChange={(val) => setIsAscending(val === "asc")}
                >
                  <DropdownMenuRadioItem value="desc">
                    Newest first
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="asc">
                    Oldest first
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Active filters display */}
      {(statuses?.length > 0 ||
        priority !== "" ||
        assignee !== "" ||
        dateRange.from ||
        dateRange.to) && (
        <div className="px-4 pb-4 flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Active filters:
          </span>

          {/* Status filters */}
          {statuses?.map((status) => (
            <Badge
              key={status}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {statusIcons[status]}
              {status}
              <button onClick={() => toggleStatus(status)} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {/* Priority filter */}
          {priority && (
            <Badge
              variant="secondary"
              className={classNames(
                "flex items-center gap-1",
                priority ? priorityConfig[priority]?.color : "",
              )}
            >
              {priorityConfig[priority]?.icon}
              {priority}
              <button onClick={() => setPriority("")} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {/* Assignee filter */}
          {assignee && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {assignee === "me" ? (
                <User className="h-4 w-4" />
              ) : (
                <Inbox className="h-4 w-4" />
              )}
              {assignee === "me" ? "Assigned to me" : "Unassigned"}
              <button onClick={() => setAssignee("")} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {/* Date range filter */}
          {(dateRange.from || dateRange.to) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              {formatDateRange()}
              <button
                onClick={() => setDateRange({ from: undefined, to: undefined })}
                className="ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {/* Clear all button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs h-7"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};

export default TicketAdvancedSearch;
