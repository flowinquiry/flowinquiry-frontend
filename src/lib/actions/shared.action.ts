import { get } from "@/lib/actions/commons.action";
import { BACKEND_API } from "@/lib/constants";
import { mapEntityToFilterOptions } from "@/lib/mappers";
import { EntityValueDefinition } from "@/types/commons";

export interface TimezoneInfo {
  zoneId: string;
  offset: string;
}

export const getTimezones = async (): Promise<Array<TimezoneInfo>> => {
  return get<Array<TimezoneInfo>>(`${BACKEND_API}/api/timezones`);
};

export const findEntitiesFilterOptions = async (
  findEntitiesFn: () => Promise<Array<EntityValueDefinition>>,
) => {
  const data = await findEntitiesFn();
  return mapEntityToFilterOptions(data);
};
