"use client";

import { PRIORITY_CONFIG } from "@/lib/constants/ticket-priorities";
import { TeamRequestPriority } from "@/types/team-requests";

export const PriorityDisplay = ({
  priority,
}: {
  priority: TeamRequestPriority;
}) => {
  // Cast the priority to our shared PriorityType
  const priorityKey = priority as TeamRequestPriority;

  // Get configuration from shared utilities
  const config = PRIORITY_CONFIG[priorityKey];

  return (
    <div className="flex items-center gap-2">
      <span className={config.iconColor}>{config.icon}</span>
      <span className={`${config.textColor} font-medium`}>{priority}</span>
    </div>
  );
};
