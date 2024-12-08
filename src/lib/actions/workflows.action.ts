"use server";

import { unstable_noStore as noStore } from "next/dist/server/web/spec-extension/unstable-no-store";

import { doAdvanceSearch, get, post, put } from "@/lib/actions/commons.action";
import { BACKEND_API } from "@/lib/constants";
import { Pagination, QueryDTO } from "@/types/query";
import {
  WorkflowDetailDTO,
  WorkflowDTO,
  WorkflowStateDTO,
} from "@/types/workflows";

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

export async function searchWorkflows(query: QueryDTO, pagination: Pagination) {
  noStore();
  return doAdvanceSearch<WorkflowDTO>(
    `${BACKEND_API}/api/workflows/search`,
    query,
    pagination,
  );
}

export const getWorkflowDetail = async (workflowId: number) => {
  return get<WorkflowDetailDTO>(
    `${BACKEND_API}/api/workflows/details/${workflowId}`,
  );
};

export const saveWorkflowDetail = async (workflowDetail: WorkflowDetailDTO) => {
  return post<WorkflowDetailDTO, WorkflowDetailDTO>(
    `${BACKEND_API}/api/workflows/details`,
    workflowDetail,
  );
};

export const updateWorkflowDetail = async (
  workflowId: number,
  workflowDetail: WorkflowDetailDTO,
) => {
  return put<WorkflowDetailDTO, WorkflowDetailDTO>(
    `${BACKEND_API}/api/workflows/details/${workflowId}`,
    workflowDetail,
  );
};
