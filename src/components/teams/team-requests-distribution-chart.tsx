"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
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
import useSWR from "swr";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { getTicketsAssignmentDistributionByTeam } from "@/lib/actions/teams-request.action";
import { obfuscate } from "@/lib/endecode";
import { useError } from "@/providers/error-provider";
import { useTimeRange } from "@/providers/time-range-provider";
import { TicketDistributionDTO } from "@/types/team-requests";

interface TicketDistributionChartProps {
  teamId: number;
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff6f61", "#d0ed57"];

const TicketDistributionChart: React.FC<TicketDistributionChartProps> = ({
  teamId,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const { setError } = useError();
  const { timeRange, customDates } = useTimeRange();

  // Generate date parameters
  const dateParams =
    timeRange === "custom"
      ? { from: customDates?.from, to: customDates?.to }
      : { range: timeRange };

  // Use SWR for automatic re-fetching
  const { data = [], isValidating } = useSWR(
    ["fetchTicketsAssignmentDistributionByTeam", teamId, dateParams],
    () => getTicketsAssignmentDistributionByTeam(teamId, dateParams, setError),
  );

  const chartData = data.map((item: TicketDistributionDTO) => ({
    name: item.userName || "Unassigned",
    value: item.ticketCount,
    userId: item.userId,
  }));

  const CustomYAxisTick = ({
    x,
    y,
    payload,
  }: {
    x: number;
    y: number;
    payload: { value: string };
  }) => {
    const user = chartData.find((item) => item.name === payload.value);

    return (
      <text
        x={x - 10}
        y={y}
        dy={4}
        textAnchor="end"
        fill="currentColor"
        style={{ color: "inherit" }}
      >
        {user?.userId ? (
          <Link
            href={`/portal/users/${obfuscate(user.userId)}`}
            key={user.userId}
            style={{ textDecoration: "underline", color: "inherit" }}
          >
            {payload.value}
          </Link>
        ) : (
          <tspan>{payload.value}</tspan>
        )}
      </text>
    );
  };

  return (
    <Card className="w-full max-w-[800px] mx-auto">
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
          <CardTitle>Ticket Distribution</CardTitle>
        </div>
      </CardHeader>

      {/* Collapsible Content */}
      {!collapsed && (
        <CardContent className="p-4">
          {isValidating ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Spinner className="h-8 w-8 mb-4" />
              <span>Loading chart data...</span>
            </div>
          ) : chartData.length === 0 ? (
            <p className="text-center">
              No ticket distribution data available.
            </p>
          ) : (
            <div className="w-full h-64 md:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  barSize={40}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={(props) => <CustomYAxisTick {...props} />}
                    width={150}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill={COLORS[0]} name="Ticket Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default TicketDistributionChart;
