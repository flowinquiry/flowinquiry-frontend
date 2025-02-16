import { get } from "@/lib/actions/commons.action";
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
