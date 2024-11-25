"use client";

import {
  AlertCircle,
  ArrowDownCircle,
  ArrowRightCircle,
  ArrowUpCircle,
  Circle,
} from "lucide-react";
import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TeamRequestPriority } from "@/types/teams";

const priorities: TeamRequestPriority[] = [
  "Critical",
  "High",
  "Medium",
  "Low",
  "Trivial",
];

const getPriorityIcon = (priority: TeamRequestPriority) => {
  switch (priority) {
    case "Critical":
      return <AlertCircle className="text-red-600" />;
    case "High":
      return <ArrowUpCircle className="text-orange-500" />;
    case "Medium":
      return <ArrowRightCircle className="text-yellow-500" />;
    case "Low":
      return <ArrowDownCircle className="text-green-500" />;
    case "Trivial":
      return <Circle className="text-gray-400" />;
    default:
      return <Circle className="text-neutral-400" />;
  }
};

const getPriorityStyle = (priority: TeamRequestPriority) => {
  switch (priority) {
    case "Critical":
      return "text-red-600 font-bold";
    case "High":
      return "text-orange-500 font-medium";
    case "Medium":
      return "text-yellow-500";
    case "Low":
      return "text-green-500";
    case "Trivial":
      return "text-gray-400";
    default:
      return "text-neutral-500";
  }
};

export const TeamRequestPrioritySelect = ({
  value,
  onChange,
}: {
  value: TeamRequestPriority;
  onChange: (value: TeamRequestPriority) => void;
}) => (
  <Select
    value={value}
    onValueChange={(value: TeamRequestPriority) => onChange(value)}
  >
    <SelectTrigger className="w-[16rem]">
      <SelectValue>
        <div className="flex items-center gap-2">
          {getPriorityIcon(value)}
          <span className={getPriorityStyle(value)}>{value}</span>
        </div>
      </SelectValue>
    </SelectTrigger>
    <SelectContent>
      {priorities.map((priority) => (
        <SelectItem key={priority} value={priority}>
          <div className="flex items-center gap-2">
            {getPriorityIcon(priority)}
            <span className={getPriorityStyle(priority)}>{priority}</span>
          </div>
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);
