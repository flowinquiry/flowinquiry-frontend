"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";

import PaginationExt from "@/components/shared/pagination-ext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getActivityLogs } from "@/lib/actions/activity-logs.action";
import { formatDateTimeDistanceToNow } from "@/lib/datetime";
import { ActivityLogDTO } from "@/types/activity-logs";
import { useError } from "@/providers/error-provider";

const RecentTeamActivities = ({ teamId }: { teamId: number }) => {
  const [activityLogs, setActivityLogs] = useState<ActivityLogDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false); // State to toggle collapse
  const { setError } = useError();

  useEffect(() => {
    async function fetchActivityLogs() {
      setLoading(true);
      getActivityLogs("Team", teamId, currentPage, 5, setError)
        .then((data) => {
          setActivityLogs(data.content);
          setTotalPages(data.totalPages);
        })
        .finally(() => setLoading(false));
    }
    fetchActivityLogs();
  }, [teamId, currentPage]);

  return (
    <Card>
      <CardHeader
        className="cursor-pointer"
        onClick={() => setCollapsed((prev) => !prev)}
      >
        <div className="flex items-center space-x-2">
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
          <CardTitle>Recent Activities</CardTitle>
        </div>
      </CardHeader>

      {!collapsed && (
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-[150px]">
              <Spinner className="h-8 w-8">
                <span>Loading data ...</span>
              </Spinner>
            </div>
          ) : activityLogs && activityLogs.length > 0 ? (
            <div className="space-y-2">
              {activityLogs.map((activityLog, index) => (
                <div
                  key={activityLog.id}
                  className={`py-4 px-4 rounded-md ${
                    index % 2 === 0
                      ? "bg-gray-50 dark:bg-gray-800"
                      : "bg-white dark:bg-gray-900"
                  }`}
                >
                  <div
                    className="prose max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{
                      __html: activityLog.content!,
                    }}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Modified at:{" "}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-pointer">
                          {formatDateTimeDistanceToNow(
                            new Date(activityLog.createdAt),
                          )}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {new Date(activityLog.createdAt).toLocaleString()}{" "}
                      </TooltipContent>
                    </Tooltip>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No activity logs available
            </p>
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

export default RecentTeamActivities;
