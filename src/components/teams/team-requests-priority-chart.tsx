"use client";

import React, { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner"; // Import your spinner component
import { getTicketsPriorityDistribution } from "@/lib/actions/teams-request.action";
import { PriorityDistributionDTO } from "@/types/team-requests";
import { TeamRequestPriority } from "@/types/team-requests";

const TicketPriorityPieChart = ({ teamId }: { teamId: number }) => {
  const [priorityData, setPriorityData] = useState<PriorityDistributionDTO[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch priority distribution data
    const fetchPriorityData = async () => {
      setLoading(true);
      getTicketsPriorityDistribution(teamId)
        .then((data) => setPriorityData(data))
        .finally(() => setLoading(false));
    };

    fetchPriorityData();
  }, [teamId]);

  // Define colors for the pie chart based on TeamRequestPriority
  const COLORS: Record<TeamRequestPriority, string> = {
    Critical: "#FF4500",
    High: "#FF6384",
    Medium: "#36A2EB",
    Low: "#FFCE56",
    Trivial: "#00FF00",
  };

  return (
    <Card className="w-full max-w-[600px] mx-auto">
      <CardHeader>
        <CardTitle>Priority Distribution</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Spinner className="h-8 w-8 mb-4">
              <span>Loading chart data...</span>
            </Spinner>
          </div>
        ) : priorityData.length === 0 ? (
          <p className="text-center">No data available.</p>
        ) : (
          <div className="w-full h-64 md:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  dataKey="ticketCount"
                  nameKey="priority"
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  fill="#8884d8"
                  label
                >
                  {priorityData.map((entry) => (
                    <Cell
                      key={`cell-${entry.priority}`}
                      fill={
                        COLORS[entry.priority as TeamRequestPriority] ||
                        "#D3D3D3"
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TicketPriorityPieChart;
