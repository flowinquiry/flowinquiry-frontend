"use client";

import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getTicketCreationDaySeries } from "@/lib/actions/teams-request.action";
import { TicketActionCountByDateDTO } from "@/types/teams";

const TicketCreationByDaySeriesChart = ({
  teamId,
  days = 7,
}: {
  teamId: number;
  days: number;
}) => {
  const [data, setData] = useState<TicketActionCountByDateDTO[]>([]);

  useEffect(() => {
    function fetchData() {
      getTicketCreationDaySeries(teamId, days).then((data) => {
        const formattedData = data.map((item) => ({
          date: item.date, // LocalDate from the API
          ticketCount: item.ticketCount,
        }));
        setData(formattedData);
      });
    }
    fetchData();
  }, [teamId, days]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="ticketCount" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TicketCreationByDaySeriesChart;
