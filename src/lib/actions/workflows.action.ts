"use server";

import { get } from "@/lib/actions/commons.action";
import { BACKEND_API } from "@/lib/constants";
import { WorkflowDTO, WorkflowStateDTO } from "@/types/workflows";

export const getWorkflowsByTeam = (teamId: number) => {
  return get<Array<WorkflowDTO>>(
    `${BACKEND_API}/api/workflows/teams/${teamId}`,
  );
};

export const getValidTargetStates = async (
  workflowId: number,
  workflowStateId: number,
  includeSelf: boolean,
) => {
  return get<Array<WorkflowStateDTO>>(
    `${BACKEND_API}/api/workflows/${workflowId}/transitions?workflowStateId=${workflowStateId}&&includeSelf=${includeSelf}`,
  );
};
