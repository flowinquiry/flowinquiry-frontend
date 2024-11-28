"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";
import { getTicketsDistribution } from "@/lib/actions/teams-request.action";
import { TicketDistributionDTO } from "@/types/team-requests";
import { obfuscate } from "@/lib/endecode";

// Props for the chart component
interface TicketDistributionChartProps {
  teamId: number; // The ID of the team to fetch data for
}

// Colors for the bar chart bars
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff6f61", "#d0ed57"];

const RequestDistributionChart: React.FC<TicketDistributionChartProps> = ({
  teamId,
}) => {
  const [data, setData] = useState<TicketDistributionDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      getTicketsDistribution(teamId)
        .then((data) => setData(data))
        .catch(() => setError("Failed to load ticket distribution data."))
        .finally(() => setLoading(false));
    };

    fetchData();
  }, [teamId]);

  // Render loading, error, or chart
  if (loading) {
    return <div>Loading ticket distribution...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (data.length === 0) {
    return <div>No ticket distribution data available.</div>;
  }

  // Map data for the chart (replace null names with "Unassigned")
  const chartData = data.map((item) => ({
    name: item.userName || "Unassigned",
    value: item.ticketCount,
    userId: item.userId, // Keep userId for routing
  }));

  // Custom Y-Axis Tick Component
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
      <text x={x} y={y} dy={4} textAnchor="end" fill="#666">
        {user?.userId ? (
          <Link
            href={`/portal/users/${obfuscate(user.userId)}`}
            key={user.userId}
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
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Ticket Distribution</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          layout="vertical" // Makes the chart horizontal
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} /> {/* Ticket count */}
          <YAxis
            type="category"
            dataKey="name"
            tick={(props) => <CustomYAxisTick {...props} />} // Use function to pass props correctly
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill={COLORS[0]} name="Ticket Count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RequestDistributionChart;
