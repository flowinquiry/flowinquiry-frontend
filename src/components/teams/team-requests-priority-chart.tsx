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
import { getTicketsPriorityDistribution } from "@/lib/actions/teams-request.action";
import { PriorityDistributionDTO } from "@/types/team-requests";
import { TeamRequestPriority } from "@/types/team-requests";

const TicketPriorityPieChart = ({ teamId }: { teamId: number }) => {
  const [priorityData, setPriorityData] = useState<PriorityDistributionDTO[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch priority distribution data
    const fetchPriorityData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getTicketsPriorityDistribution(teamId);
        setPriorityData(data);
      } catch (err) {
        setError("Failed to load priority distribution data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
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
        {loading && <p className="text-center">Loading...</p>}

        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && priorityData.length === 0 && (
          <p className="text-center">No data available.</p>
        )}

        {!loading && !error && priorityData.length > 0 && (
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
