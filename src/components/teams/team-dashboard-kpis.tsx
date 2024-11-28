"use client";

import { useRouter } from "next/navigation";
import React from "react";

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

const TeamDashboardTopSection = () => {
  const router = useRouter();

  const metrics = [
    {
      title: "Total Tickets",
      description: "All tickets received",
      value: 152,
      color: "text-gray-700 dark:text-gray-300",
      link: "/dashboard/requests/all",
      tooltip: "View all team tickets.",
    },
    {
      title: "Pending Tickets",
      description: "Tickets yet to be addressed",
      value: 42,
      color: "text-yellow-500",
      link: "/dashboard/requests/pending",
      tooltip: "View tickets that are still pending.",
    },
    {
      title: "Completed Tickets",
      description: "Successfully resolved tickets",
      value: 100,
      color: "text-green-500",
      link: "/dashboard/requests/completed",
      tooltip: "View tickets that have been resolved.",
    },
    {
      title: "Overdue Tickets",
      description: "Tickets past their deadline",
      value: 10,
      color: "text-red-500",
      link: "/dashboard/requests/overdue",
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
