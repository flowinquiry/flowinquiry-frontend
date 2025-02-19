import { deleteExec, get, post } from "@/lib/actions/commons.action";
import { HttpError } from "@/lib/errors";
import { EntityType, EntityWatcherDTO } from "@/types/commons";

export const getEntityWatchers = async (
  entityType: EntityType,
  entityId: number,
  setError?: (error: HttpError | string | null) => void,
) => {
  return get<EntityWatcherDTO[]>(
    `/api/entity-watchers?entityType=${entityType}&&entityId=${entityId}`,
    setError,
  );
};

export const addWatchers = async (
  entityType: EntityType,
  entityId: number,
  watcherIds: Array<number>,
  setError?: (error: HttpError | string | null) => void,
) => {
  return post<Array<number>, void>(
    `/api/entity-watchers/add?entityType=${entityType}&&entityId=${entityId}`,
    watcherIds,
    setError,
  );
};

export const deleteWatchers = async (
  entityType: EntityType,
  entityId: number,
  watcherIds: Array<number>,
  setError?: (error: HttpError | string | null) => void,
) => {
  return deleteExec<Array<number>, void>(
    `/api/entity-watchers/remove?entityType=${entityType}&&entityId=${entityId}`,
    watcherIds,
    setError,
  );
};
