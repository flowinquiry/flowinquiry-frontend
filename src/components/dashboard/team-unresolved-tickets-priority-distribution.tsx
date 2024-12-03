"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { getTeamTicketPriorityDistributionForUser } from "@/lib/actions/teams-request.action";
import { TeamRequestPriority } from "@/types/team-requests";

const TeamUnresolvedTicketsPriorityDistributionChart = () => {
  const { data: session } = useSession();
  const userId = Number(session?.user?.id!);

  const [data, setData] = useState<
    Record<string, Record<TeamRequestPriority, number>>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      getTeamTicketPriorityDistributionForUser(userId)
        .then((result) => {
          const chartData = result.reduce(
            (acc, item) => {
              if (!acc[item.teamName]) {
                acc[item.teamName] = {
                  Critical: 0,
                  High: 0,
                  Medium: 0,
                  Low: 0,
                  Trivial: 0,
                };
              }
              acc[item.teamName][item.priority] = item.count;
              return acc;
            },
            {} as Record<string, Record<TeamRequestPriority, number>>,
          );

          setData(chartData);
        })
        .finally(() => setLoading(false));
    };

    fetchData();
  }, []);

  const chartData = Object.entries(data).map(([teamName, priorities]) => ({
    teamName,
    ...priorities,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unresolved Tickets by Team</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%">
          {loading ? (
            <div className="flex justify-center items-center">
              <Spinner />
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex justify-center items-center">
              <p className="text-gray-500">No data available to display.</p>
            </div>
          ) : (
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 150,
                bottom: 20,
              }}
              barSize={40} // Set a fixed bar size
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="teamName" />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="Critical"
                stackId="a"
                fill="#dc2626"
              /> {/* Red */}
              <Bar
                dataKey="High"
                stackId="a"
                fill="#ea580c"
              /> {/* Orange */}
              <Bar
                dataKey="Medium"
                stackId="a"
                fill="#facc15"
              /> {/* Yellow */}
              <Bar
                dataKey="Low"
                stackId="a"
                fill="#22c55e"
              /> {/* Green */}
              <Bar
                dataKey="Trivial"
                stackId="a"
                fill="#9ca3af"
              /> {/* Gray */}
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TeamUnresolvedTicketsPriorityDistributionChart;
