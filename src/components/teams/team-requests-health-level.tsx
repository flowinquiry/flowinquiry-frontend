import React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Import ShadCN Tooltip components

type HealthLevel = "critical" | "poor" | "fair" | "good" | "excellent";

type HealthLevelStarsProps = {
  currentLevel: HealthLevel;
};

// Tooltip content for each level
const tooltips: Record<HealthLevel, { title: string; description: string }> = {
  critical: {
    title: "Critical",
    description:
      "Severe issues or unresolved problems requiring immediate action.",
  },
  poor: {
    title: "Poor",
    description:
      "Significant problems with some resolutions but still needs attention.",
  },
  fair: {
    title: "Fair",
    description:
      "Moderate health; some issues are resolved, but room for improvement.",
  },
  good: {
    title: "Good",
    description:
      "Most issues are resolved, and the conversation is progressing well.",
  },
  excellent: {
    title: "Excellent",
    description:
      "No significant issues; the conversation is in perfect health.",
  },
};

// Define colors for light and dark modes
const colorMap: Record<
  HealthLevel | "unselected",
  { light: string; dark: string }
> = {
  critical: {
    light: "bg-red-700",
    dark: "bg-red-400",
  },
  poor: {
    light: "bg-red-500",
    dark: "bg-red-300",
  },
  fair: {
    light: "bg-yellow-400",
    dark: "bg-yellow-200",
  },
  good: {
    light: "bg-green-500",
    dark: "bg-green-300",
  },
  excellent: {
    light: "bg-green-700",
    dark: "bg-green-400",
  },
  unselected: {
    light: "bg-gray-300",
    dark: "bg-gray-600",
  },
};

const TeamRequestHealthLevel: React.FC<HealthLevelStarsProps> = ({
  currentLevel,
}) => {
  const levels: HealthLevel[] = [
    "critical",
    "poor",
    "fair",
    "good",
    "excellent",
  ];

  return (
    <div className="flex items-center gap-4">
      {levels.map((level) => (
        <Tooltip key={level}>
          <TooltipTrigger asChild>
            <div
              className={`w-6 h-6 rounded-full transition-colors duration-300 ${
                levels.indexOf(level) <= levels.indexOf(currentLevel)
                  ? `${colorMap[level].light} dark:${colorMap[level].dark}`
                  : `${colorMap.unselected.light} dark:${colorMap.unselected.dark}`
              }`}
            ></div>
          </TooltipTrigger>
          <TooltipContent className="text-sm">
            <strong className="block text-base">{tooltips[level].title}</strong>
            <span className="text-xs text-gray-500">
              {tooltips[level].description}
            </span>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};

export default TeamRequestHealthLevel;
