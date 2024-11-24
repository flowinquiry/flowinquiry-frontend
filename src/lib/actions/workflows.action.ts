"use server";

import { get } from "@/lib/actions/commons.action";
import { BACKEND_API } from "@/lib/constants";
import { WorkflowDTO } from "@/types/workflows";

export const getWorkflowsByTeam = (teamId: number) => {
  return get<Array<WorkflowDTO>>(
    `${BACKEND_API}/api/workflows/teams/${teamId}`,
  );
};
