"use client";

import React, { useEffect, useState } from "react";

import PaginationExt from "@/components/shared/pagination-ext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { getActivityLogs } from "@/lib/actions/activity-logs.action";
import { formatDateTimeDistanceToNow } from "@/lib/datetime";
import { ActivityLogDTO } from "@/types/activity-logs";
import { TeamDTO } from "@/types/teams";

type DashboardTrendsAndActivityProps = {
  team: TeamDTO;
};

const RecentTeamActivities = ({ team }: DashboardTrendsAndActivityProps) => {
  const [activityLogs, setActivityLogs] = useState<ActivityLogDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    async function fetchActivityLogs() {
      setLoading(true);
      getActivityLogs("Team", team.id!, currentPage, 5)
        .then((data) => {
          setActivityLogs(data.content);
          setTotalPages(data.totalPages);
        })
        .finally(() => setLoading(false));
    }
    fetchActivityLogs();
  }, [team, currentPage]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
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
                  {formatDateTimeDistanceToNow(new Date(activityLog.createdAt))}
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
    </Card>
  );
};

export default RecentTeamActivities;
