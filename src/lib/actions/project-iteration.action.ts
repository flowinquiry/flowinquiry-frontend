import { get, post } from "@/lib/actions/commons.action";
import { HttpError } from "@/lib/errors";
import { ProjectIterationDTO } from "@/types/projects";

export const createProjectIteration = async (
  projectIteration: ProjectIterationDTO,
  setError?: (error: HttpError | string | null) => void,
) => {
  return post<ProjectIterationDTO, ProjectIterationDTO>(
    `/api/project-iterations`,
    projectIteration,
    setError,
  );
};

export const findIterationsByProjectId = async (
  projectId: number,
  setError?: (error: HttpError | string | null) => void,
) => {
  return get<Array<ProjectIterationDTO>>(
    `/api/projects/${projectId}/iterations`,
    setError,
  );
};
