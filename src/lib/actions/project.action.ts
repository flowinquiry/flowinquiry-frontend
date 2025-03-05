import {
  deleteExec,
  doAdvanceSearch,
  get,
  post,
  put,
} from "@/lib/actions/commons.action";
import { HttpError } from "@/lib/errors";
import { ProjectDTO } from "@/types/projects";
import { Pagination, QueryDTO } from "@/types/query";
import { WorkflowDetailDTO } from "@/types/workflows";

export const createProject = async (
  project: ProjectDTO,
  setError?: (error: HttpError | string | null) => void,
) => {
  return post<ProjectDTO, ProjectDTO>(`/api/projects`, project, setError);
};

export const updateProject = async (
  projectId: number,
  project: ProjectDTO,
  setError?: (error: HttpError | string | null) => void,
) => {
  return put<ProjectDTO, ProjectDTO>(
    `/api/projects/${projectId}`,
    project,
    setError,
  );
};

export const findProjectById = async (
  projectId: number,
  setError?: (error: HttpError | string | null) => void,
) => {
  return get<ProjectDTO>(`/api/projects/${projectId}`, setError);
};

export const searchProjects = async (
  query: QueryDTO,
  pagination: Pagination,
  setError?: (error: HttpError | string | null) => void,
) => {
  return doAdvanceSearch<ProjectDTO>(
    `/api/projects/search`,
    query,
    pagination,
    setError,
  );
};

export const findProjectWorkflowByTeam = async (
  teamId: number,
  setError?: (error: HttpError | string | null) => void,
) => {
  return get<WorkflowDetailDTO>(
    `/api/workflows/teams/${teamId}/project-workflow`,
    setError,
  );
};

export async function deleteProject(
  projectId: number,
  setError?: (error: HttpError | string | null) => void,
) {
  return deleteExec(`/api/projects/${projectId}`, setError);
}
