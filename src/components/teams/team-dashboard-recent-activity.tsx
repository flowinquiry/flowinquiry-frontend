"use client";

import React, { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getActivityLogs } from "@/lib/actions/activity-logs.action";
import { formatDateTimeDistanceToNow } from "@/lib/datetime";
import { ActivityLogDTO } from "@/types/activity-logs";
import { TeamDTO } from "@/types/teams";

type DashboardTrendsAndActivityProps = {
  team: TeamDTO;
};

const RecentTeamActivities = ({ team }: DashboardTrendsAndActivityProps) => {
  const [activityLogs, setActivityLogs] = useState<ActivityLogDTO[]>([]);

  useEffect(() => {
    async function fetchActivityLogs() {
      getActivityLogs("Team", team.id!).then((data) => {
        setActivityLogs(data.content);
      });
    }
    fetchActivityLogs();
  }, [team]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activityLogs && activityLogs.length > 0 ? (
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
      </CardContent>
    </Card>
  );
};

export default RecentTeamActivities;
