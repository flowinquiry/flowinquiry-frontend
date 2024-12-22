"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
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
import { Spinner } from "@/components/ui/spinner";
import { getTicketsPriorityDistributionByTeam } from "@/lib/actions/teams-request.action";
import { useError } from "@/providers/error-provider";
import { PriorityDistributionDTO } from "@/types/team-requests";
import { TeamRequestPriority } from "@/types/team-requests";

const TicketPriorityPieChart = ({ teamId }: { teamId: number }) => {
  const [priorityData, setPriorityData] = useState<PriorityDistributionDTO[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const { setError } = useError();

  useEffect(() => {
    const fetchPriorityData = async () => {
      setLoading(true);
      getTicketsPriorityDistributionByTeam(teamId, setError)
        .then((data) => setPriorityData(data))
        .finally(() => setLoading(false));
    };

    fetchPriorityData();
  }, [teamId]);

  // Define colors for the pie chart
  const COLORS: Record<TeamRequestPriority, string> = {
    Critical: "#DC2626", // text-red-600
    High: "#F97316", // text-orange-500
    Medium: "#F59E0B", // text-yellow-500
    Low: "#16A34A", // text-green-500
    Trivial: "#9CA3AF", // text-gray-400
  };

  return (
    <Card className="w-full max-w-[600px] mx-auto">
      {/* Header with Chevron Icon and Title */}
      <CardHeader>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="flex items-center p-0"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
          <CardTitle>Priority Distribution</CardTitle>
        </div>
      </CardHeader>

      {/* Collapsible Content */}
      {!collapsed && (
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
      )}
    </Card>
  );
};

export default TicketPriorityPieChart;
