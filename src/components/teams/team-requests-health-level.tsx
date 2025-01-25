import React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TicketHealthLevel } from "@/types/team-requests";

type HealthLevelProgressProps = {
  currentLevel: TicketHealthLevel;
};

// Tooltip content for each health level
const tooltips: Record<
  TicketHealthLevel,
  { title: string; description: string }
> = {
  [TicketHealthLevel.Critical]: {
    title: "Critical",
    description:
      "Severe issues or unresolved problems requiring immediate action.",
  },
  [TicketHealthLevel.Poor]: {
    title: "Poor",
    description:
      "Significant problems with some resolutions but still needs attention.",
  },
  [TicketHealthLevel.Fair]: {
    title: "Fair",
    description:
      "Moderate health; some issues are resolved, but room for improvement.",
  },
  [TicketHealthLevel.Good]: {
    title: "Good",
    description:
      "Most issues are resolved, and the conversation is progressing well.",
  },
  [TicketHealthLevel.Excellent]: {
    title: "Excellent",
    description:
      "No significant issues; the conversation is in perfect health.",
  },
};

// Map levels to numerical values for progress calculation
const levelMap: Record<TicketHealthLevel, number> = {
  [TicketHealthLevel.Critical]: 1,
  [TicketHealthLevel.Poor]: 2,
  [TicketHealthLevel.Fair]: 3,
  [TicketHealthLevel.Good]: 4,
  [TicketHealthLevel.Excellent]: 5,
};

const TeamRequestHealthLevel: React.FC<HealthLevelProgressProps> = ({
  currentLevel,
}) => {
  const starsCount = levelMap[currentLevel]; // Number of filled stars

  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((index) => (
        <Tooltip key={index}>
          <TooltipTrigger asChild>
            <span
              className={`text-xl cursor-pointer ${
                index <= starsCount ? "text-yellow-500" : "text-gray-300"
              }`}
            >
              ★
            </span>
          </TooltipTrigger>
          <TooltipContent className="text-sm max-w-xs">
            {index === starsCount && (
              <>
                <strong className="block text-base">
                  {tooltips[currentLevel].title}
                </strong>
                <p className="text-xs text-gray-500">
                  {tooltips[currentLevel].description}
                </p>
              </>
            )}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};

export default TeamRequestHealthLevel;
