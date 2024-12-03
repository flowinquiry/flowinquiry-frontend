"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getCountOverdueTicketsByTeamId,
  getTicketStatisticsByTeamId,
} from "@/lib/actions/teams-request.action";

const TeamDashboardTopSection = ({ teamId }: { teamId: number }) => {
  const router = useRouter();
  const [totalTickets, setTotalTickets] = useState(0);
  const [pendingTickets, setPendingTickets] = useState(0);
  const [completedTickets, setCompletedTickets] = useState(0);
  const [overDueTickets, setOverdueTickets] = useState(0);

  useEffect(() => {
    async function fetchStatisticData() {
      getTicketStatisticsByTeamId(teamId).then((data) => {
        setTotalTickets(data.totalTickets);
        setPendingTickets(data.pendingTickets);
        setCompletedTickets(data.completedTickets);
      });
      getCountOverdueTicketsByTeamId(teamId).then((data) =>
        setOverdueTickets(data),
      );
    }
    fetchStatisticData();
  }, [teamId]);

  const metrics = [
    {
      title: "Total Tickets",
      description: "All tickets received",
      value: totalTickets ?? 0,
      color: "text-gray-700 dark:text-gray-300",
      link: "#",
      tooltip: "View all team tickets.",
    },
    {
      title: "Pending Tickets",
      description: "Tickets yet to be addressed",
      value: pendingTickets ?? 0,
      color: "text-yellow-500",
      link: "#",
      tooltip: "View tickets that are still pending.",
    },
    {
      title: "Completed Tickets",
      description: "Successfully resolved tickets",
      value: completedTickets ?? 0,
      color: "text-green-500",
      link: "#",
      tooltip: "View tickets that have been resolved.",
    },
    {
      title: "Overdue Tickets",
      description: "Tickets past their deadline",
      value: overDueTickets ?? 0,
      color: "text-red-500",
      link: "#",
      tooltip: "View overdue tickets that need attention.",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Tooltip key={index}>
          <TooltipTrigger asChild>
            <Card
              onClick={() => router.push(metric.link)}
              className="cursor-pointer hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle>{metric.title}</CardTitle>
                <CardDescription>{metric.description}</CardDescription>
              </CardHeader>
              <CardContent className={`text-3xl font-bold ${metric.color}`}>
                {metric.value}
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>{metric.tooltip}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};

export default TeamDashboardTopSection;
