import { doAdvanceSearch, get, post } from "@/lib/actions/commons.action";
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
