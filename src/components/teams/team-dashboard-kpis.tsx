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
      title: "Total Requests",
      description: "All requests received",
      value: 152,
      color: "text-gray-700 dark:text-gray-300",
      link: "/dashboard/requests/all",
      tooltip: "View all team requests.",
    },
    {
      title: "Pending Requests",
      description: "Requests yet to be addressed",
      value: 42,
      color: "text-yellow-500",
      link: "/dashboard/requests/pending",
      tooltip: "View requests that are still pending.",
    },
    {
      title: "Completed Requests",
      description: "Successfully resolved requests",
      value: 100,
      color: "text-green-500",
      link: "/dashboard/requests/completed",
      tooltip: "View requests that have been resolved.",
    },
    {
      title: "Overdue Requests",
      description: "Requests past their deadline",
      value: 10,
      color: "text-red-500",
      link: "/dashboard/requests/overdue",
      tooltip: "View overdue requests that need attention.",
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
