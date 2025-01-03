import {
  deleteExec,
  doAdvanceSearch,
  get,
  post,
  put,
} from "@/lib/actions/commons.action";
import { HttpError } from "@/lib/errors";
import { Pagination, QueryDTO } from "@/types/query";
import {
  WorkflowDetailDTO,
  WorkflowDTO,
  WorkflowStateDTO,
} from "@/types/workflows";

export const getWorkflowsByTeam = (
  teamId: number,
  setError?: (error: HttpError | string | null) => void,
) => {
  return get<Array<WorkflowDTO>>(`/api/workflows/teams/${teamId}`, setError);
};

export const getGlobalWorkflowHasNotLinkedWithTeam = (
  teamId: number,
  setError?: (error: HttpError | string | null) => void,
) => {
  return get<Array<WorkflowDTO>>(
    `/api/workflows/teams/${teamId}/global-workflows-not-linked-yet`,
    setError,
  );
};

export const getValidTargetStates = async (
  workflowId: number,
  workflowStateId: number,
  includeSelf: boolean,
  setError?: (error: HttpError | string | null) => void,
) => {
  return get<Array<WorkflowStateDTO>>(
    `/api/workflows/${workflowId}/transitions?workflowStateId=${workflowStateId}&&includeSelf=${includeSelf}`,
    setError,
  );
};

export async function searchWorkflows(
  query: QueryDTO,
  pagination: Pagination,
  setError?: (error: HttpError | string | null) => void,
) {
  return doAdvanceSearch<WorkflowDTO>(
    `/api/workflows/search`,
    query,
    pagination,
    setError,
  );
}

export const getWorkflowDetail = async (
  workflowId: number,
  setError?: (error: HttpError | string | null) => void,
) => {
  return get<WorkflowDetailDTO>(
    `/api/workflows/details/${workflowId}`,
    setError,
  );
};

export const saveWorkflowDetail = async (
  workflowDetail: WorkflowDetailDTO,
  setError?: (error: HttpError | string | null) => void,
) => {
  return post<WorkflowDetailDTO, WorkflowDetailDTO>(
    `/api/workflows/details`,
    workflowDetail,
    setError,
  );
};

export const updateWorkflowDetail = async (
  workflowId: number,
  workflowDetail: WorkflowDetailDTO,
  setError?: (error: HttpError | string | null) => void,
) => {
  return put<WorkflowDetailDTO, WorkflowDetailDTO>(
    `/api/workflows/details/${workflowId}`,
    workflowDetail,
    setError,
  );
};

export const createWorkflowFromReference = async (
  teamId: number,
  referenceWorkflowId: number,
  workflowDto: WorkflowDTO,
  setError?: (error: HttpError | string | null) => void,
) => {
  return post<WorkflowDTO, WorkflowDetailDTO>(
    `/api/workflows/${referenceWorkflowId}/teams/${teamId}/create-workflow-reference`,
    workflowDto,
    setError,
  );
};

export const createWorkflowFromCloning = async (
  teamId: number,
  cloneWorkflowId: number,
  workflowDto: WorkflowDTO,
  setError?: (error: HttpError | string | null) => void,
) => {
  return post<WorkflowDTO, WorkflowDetailDTO>(
    `/api/workflows/${cloneWorkflowId}/teams/${teamId}/create-workflow-clone`,
    workflowDto,
    setError,
  );
};

export const deleteWorkflow = async (
  workflowId: number,
  setError?: (error: HttpError | string | null) => void,
) => {
  return deleteExec(`/api/workflows/${workflowId}`, undefined, setError);
};
