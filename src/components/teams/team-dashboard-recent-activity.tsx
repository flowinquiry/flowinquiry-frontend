"use client";

import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getActivityLogs } from "@/lib/actions/activity-logs.action";
import { formatDateTimeDistanceToNow } from "@/lib/datetime";
import { ActivityLogDTO } from "@/types/activity-logs";
import { TeamDTO } from "@/types/teams";

// Sample Data
const requestTrendsData = [
  { week: "Week 1", requests: 10 },
  { week: "Week 2", requests: 20 },
  { week: "Week 3", requests: 15 },
  { week: "Week 4", requests: 25 },
];

type DashboardTrendsAndActivityProps = {
  team: TeamDTO;
};

const DashboardTrendsAndActivity = ({
  team,
}: DashboardTrendsAndActivityProps) => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Request Trends */}
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Request Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            width={500}
            height={300}
            data={requestTrendsData}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="requests" stroke="#8884d8" />
          </LineChart>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activityLogs && activityLogs.length > 0 ? (
            activityLogs.map((activityLog) => (
              <div key={activityLog.id} className="border-b pb-2">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: activityLog.content!,
                  }}
                />
                <p className="text-xs text-gray-500">
                  {formatDateTimeDistanceToNow(new Date(activityLog.createdAt))}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No activity logs available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardTrendsAndActivity;
