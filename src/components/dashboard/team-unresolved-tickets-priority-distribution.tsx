"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
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
import { useError } from "@/providers/error-provider";

const PRIORITY_COLORS: Record<TeamRequestPriority, string> = {
  Critical: "#dc2626",
  High: "#ea580c",
  Medium: "#facc15",
  Low: "#22c55e",
  Trivial: "#9ca3af",
};

const TeamUnresolvedTicketsPriorityDistributionChart = () => {
  const { data: session } = useSession();
  const userId = Number(session?.user?.id!);

  const [data, setData] = useState<
    Record<string, Record<TeamRequestPriority, number>>
  >({});
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false); // State for collapsible content
  const { setError } = useError();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getTeamTicketPriorityDistributionForUser(
          userId,
          setError,
        );
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const chartData = Object.entries(data).map(([teamName, priorities]) => ({
    teamName,
    ...priorities,
  }));

  return (
    <Card>
      {/* Header with Chevron Icon and Title */}
      <CardHeader>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center p-0"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
          <CardTitle>Unresolved Tickets by Team</CardTitle>
        </div>
      </CardHeader>

      {/* Collapsible Content */}
      {!collapsed && (
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
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
                barSize={40}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="teamName" />
                <Tooltip />
                <Legend />
                {Object.keys(PRIORITY_COLORS).map((priority) => (
                  <Bar
                    key={`bar-${priority}`}
                    dataKey={priority}
                    stackId="a"
                    fill={PRIORITY_COLORS[priority as TeamRequestPriority]}
                  />
                ))}
              </BarChart>
            )}
          </ResponsiveContainer>
        </CardContent>
      )}
    </Card>
  );
};

export default TeamUnresolvedTicketsPriorityDistributionChart;
