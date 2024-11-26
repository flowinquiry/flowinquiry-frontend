import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const teamMetrics = [
  {
    title: "Avg. Completion Time",
    value: "2 days",
    description: "Average time to complete a request",
  },
  {
    title: "Requests Completed",
    value: 100,
    description: "Total number of completed requests",
  },
  {
    title: "Open Requests",
    value: 50,
    description: "Requests currently in progress",
  },
];

const TeamPerformanceMetrics = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {teamMetrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{metric.title}</CardTitle>
            <CardDescription>{metric.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{metric.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TeamPerformanceMetrics;
