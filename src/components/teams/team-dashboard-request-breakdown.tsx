"use client";

import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const requestStatusData = [
  { name: "New", value: 40, color: "#4caf50" },
  { name: "In Progress", value: 30, color: "#ff9800" },
  { name: "Completed", value: 20, color: "#2196f3" },
  { name: "Overdue", value: 10, color: "#f44336" },
];

const priorityData = [
  { name: "Critical", count: 15 },
  { name: "High", count: 25 },
  { name: "Medium", count: 35 },
  { name: "Low", count: 20 },
  { name: "Trivial", count: 5 },
];

const COLORS = requestStatusData.map((entry) => entry.color);

const TeamDashboardRequestBreakdown = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Request Status Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Requests by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <PieChart width={300} height={300}>
            <Pie
              data={requestStatusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {requestStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </CardContent>
      </Card>

      {/* Priority Breakdown Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Requests by Priority</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart
            width={400}
            height={300}
            data={priorityData}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamDashboardRequestBreakdown;
