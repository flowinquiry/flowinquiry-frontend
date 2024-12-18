import {
  deleteExec,
  doAdvanceSearch,
  get,
  post,
  put,
} from "@/lib/actions/commons.action";
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

export const getGlobalWorkflowHasNotLinkedWithTeam = (teamId: number) => {
  return get<Array<WorkflowDTO>>(
    `${BACKEND_API}/api/workflows/teams/${teamId}/global-workflows-not-linked-yet`,
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

export const createWorkflowFromReference = async (
  teamId: number,
  referenceWorkflowId: number,
  workflowDto: WorkflowDTO,
) => {
  return post<WorkflowDTO, WorkflowDetailDTO>(
    `${BACKEND_API}/api/workflows/${referenceWorkflowId}/teams/${teamId}/create-workflow-reference`,
    workflowDto,
  );
};

export const createWorkflowFromCloning = async (
  teamId: number,
  cloneWorkflowId: number,
  workflowDto: WorkflowDTO,
) => {
  return post<WorkflowDTO, WorkflowDetailDTO>(
    `${BACKEND_API}/api/workflows/${cloneWorkflowId}/teams/${teamId}/create-workflow-clone`,
    workflowDto,
  );
};

export const deleteWorkflow = async (workflowId: number) => {
  return deleteExec(`${BACKEND_API}/api/workflows/${workflowId}`);
};
