import { deleteExec, get, post } from "@/lib/actions/commons.action";
import { BACKEND_API } from "@/lib/constants";
import {
  AuthorityDTO,
  AuthorityResourcePermissionDTO,
} from "@/types/authorities";
import { PageableResult } from "@/types/commons";
import { createQueryParams, Pagination } from "@/types/query";
import { UserDTO } from "@/types/users";

export const getAuthorities = async (
  page: number,
  setError?: (error: string | null) => void,
) => {
  return get<PageableResult<AuthorityDTO>>(
    `${BACKEND_API}/api/authorities?page=${page}&size=2000&sort=descriptiveName,asc`,
    setError,
  );
};

export const findAuthorityByName = async (
  name: string,
  setError?: (error: string | null) => void,
) => {
  return get<AuthorityDTO>(`${BACKEND_API}/api/authorities/${name}`, setError);
};

export const createAuthority = async (
  authority: AuthorityDTO,
  setError?: (error: string | null) => void,
) => {
  return post<AuthorityDTO, AuthorityDTO>(
    `${BACKEND_API}/api/authorities`,
    authority,
    setError,
  );
};

export const deleteAuthority = async (
  authority_name: string,
  setError?: (error: string | null) => void,
) => {
  return deleteExec<string, void>(
    `${BACKEND_API}/api/authorities/${authority_name}`,
    undefined,
    setError,
  );
};

export const findPermissionsByAuthorityName = async (
  authorityName: string,
  setError?: (error: string | null) => void,
) => {
  return get<Array<AuthorityResourcePermissionDTO>>(
    `${BACKEND_API}/api/authority-permissions/${authorityName}`,
    setError,
  );
};

export const batchSavePermissions = async (
  permissions: Array<AuthorityResourcePermissionDTO>,
  setError?: (error: string | null) => void,
) => {
  return post<
    Array<AuthorityResourcePermissionDTO>,
    Array<AuthorityResourcePermissionDTO>
  >(
    `${BACKEND_API}/api/authority-permissions/batchSave`,
    permissions,
    setError,
  );
};

export async function getUsersByAuthority(
  authority: string,
  pagination: Pagination,
) {
  const queryParams = createQueryParams(pagination);
  return get<PageableResult<UserDTO>>(
    `${BACKEND_API}/api/authorities/${authority}/users?${queryParams.toString()}`,
  );
}

export async function findUsersNotInAuthority(
  userTerm: string,
  authorityName: string,
) {
  return get<Array<UserDTO>>(
    `${BACKEND_API}/api/authorities/searchUsersNotInAuthority?userTerm=${userTerm}&&authorityName=${authorityName}`,
  );
}

export const addUsersToAuthority = (
  authorityName: string,
  userIds: number[],
) => {
  return post(
    `${BACKEND_API}/api/authorities/${authorityName}/add-users`,
    userIds,
  );
};

export const deleteUserFromAuthority = async (
  authorityName: string,
  userId: number,
) => {
  return deleteExec(
    `${BACKEND_API}/api/authorities/${authorityName}/users/${userId}`,
  );
};
