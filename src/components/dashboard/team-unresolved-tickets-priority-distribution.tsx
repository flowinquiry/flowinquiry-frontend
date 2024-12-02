"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Priority type
export type TeamRequestPriority =
  | "Critical"
  | "High"
  | "Medium"
  | "Low"
  | "Trivial";

const TeamUnresolvedTicketsPriorityDistributionChart = () => {
  // Static data for now, will be dynamic later
  const data = [
    {
      teamName: "Team A",
      Critical: 5,
      High: 10,
      Medium: 15,
      Low: 5,
      Trivial: 2,
    },
    {
      teamName: "Team B",
      Critical: 3,
      High: 20,
      Medium: 10,
      Low: 8,
      Trivial: 4,
    },
    {
      teamName: "Team C",
      Critical: 2,
      High: 5,
      Medium: 7,
      Low: 2,
      Trivial: 1,
    },
    {
      teamName: "Team D",
      Critical: 6,
      High: 12,
      Medium: 6,
      Low: 3,
      Trivial: 0,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unresolved Tickets by Team</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            layout="vertical"
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 100,
              bottom: 5,
            }}
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
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TeamUnresolvedTicketsPriorityDistributionChart;
