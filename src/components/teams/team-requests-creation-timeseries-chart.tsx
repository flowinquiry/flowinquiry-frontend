"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { getTicketCreationDaySeries } from "@/lib/actions/teams-request.action";
import { TicketActionCountByDateDTO } from "@/types/teams";

const TicketCreationByDaySeriesChart = ({
  teamId,
  days = 7,
}: {
  teamId: number;
  days: number;
}) => {
  const [data, setData] = useState<
    (TicketActionCountByDateDTO & { displayDay: string })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false); // State for collapsible content

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      getTicketCreationDaySeries(teamId, days)
        .then((data) => {
          const formattedData = data.map((item, index) => ({
            ...item,
            displayDay: `Day ${index + 1}`,
          }));
          setData(formattedData);
        })
        .finally(() => setLoading(false));
    }
    fetchData();
  }, [teamId, days]);

  return (
    <Card className="w-full">
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
          <CardTitle className="text-left">
            Daily Ticket Trends (Created & Closed)
          </CardTitle>
        </div>
      </CardHeader>

      {/* Collapsible Content */}
      {!collapsed && (
        <CardContent className="h-[400px] flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center">
              <Spinner className="mb-4">
                <span>Loading chart data...</span>
              </Spinner>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="displayDay" // Use "Day 1", "Day 2", etc., for better readability
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${value}`,
                    name === "Created Tickets"
                      ? `Created Tickets`
                      : `Closed Tickets`,
                  ]}
                  labelFormatter={(label: string) => {
                    const date = data.find((d) => d.displayDay === label)?.date;
                    return <span>{date || "Unknown Date"}</span>;
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="createdCount"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  name="Created Tickets"
                />
                <Line
                  type="monotone"
                  dataKey="closedCount"
                  stroke="#82ca9d"
                  name="Closed Tickets"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default TicketCreationByDaySeriesChart;
