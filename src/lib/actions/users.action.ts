import { unstable_noStore as noStore } from "next/dist/server/web/spec-extension/unstable-no-store";

import {
  deleteExec,
  doAdvanceSearch,
  get,
  post,
  put,
  SecurityMode,
} from "@/lib/actions/commons.action";
import { HttpError } from "@/lib/errors";
import { Permission } from "@/providers/permissions-provider";
import { Pagination, QueryDTO } from "@/types/query";
import { UserDTO, UserHierarchyDTO } from "@/types/users";

export async function searchUsers(
  query: QueryDTO,
  pagination: Pagination,
  setError?: (error: HttpError | string | null) => void,
) {
  noStore();
  return doAdvanceSearch<UserDTO>(
    `/api/users/search`,
    query,
    pagination,
    setError,
  );
}

export async function submitSocialToken(
  provider: string,
  accessToken: string,
  setError?: (error: HttpError | string | null) => void,
) {
  return post<
    { provider: string; socialToken: string },
    { jwtToken: string; user: UserDTO }
  >(
    `/api/auth/social-login`,
    {
      provider: provider,
      socialToken: accessToken, // Social token from NextAuth
    },
    setError,
    SecurityMode.NOT_SECURE,
  );
}

export const getUserPermissions = async (
  userId: number,
  setError?: (error: HttpError | string | null) => void,
) => {
  return get<Array<Permission>>(`/api/users/permissions/${userId}`, setError);
};

export const getDirectReports = async (
  userId: number,
  setError?: (error: HttpError | string | null) => void,
) => {
  return get<Array<UserDTO>>(`/api/users/${userId}/direct-reports`, setError);
};

export const findUserById = async (
  userId: number,
  setError?: (error: HttpError | string | null) => void,
) => {
  return get<UserDTO>(`/api/users/${userId}`, setError);
};

export const createUser = async (
  user: UserDTO,
  setError?: (error: HttpError | string | null) => void,
) => {
  return post<UserDTO, UserDTO>(`/api/users`, user, setError);
};

export const updateUser = async (
  userForm: FormData,
  setError?: (error: HttpError | string | null) => void,
) => {
  return put<FormData, UserDTO>(`/api/users`, userForm, setError);
};

export const deleteUser = async (
  userId: number,
  setError?: (error: HttpError | string | null) => void,
) => {
  return deleteExec(`/api/users/${userId}`, setError);
};

export const resendActivationEmail = async (
  email: string,
  setError?: (error: HttpError | string | null) => void,
) => {
  return get(`/api/${email}/resend-activation-email`, setError);
};

export const passwordReset = async (
  key: string,
  password: string,
  setError?: (error: HttpError | string | null) => void,
) => {
  await post(
    `/api/account/reset-password/finish`,
    { key: key, newPassword: password },
    setError,
    SecurityMode.NOT_SECURE,
  );
};

export const forgotPassword = async (
  email: string,
  setError?: (error: HttpError | string | null) => void,
) => {
  await get(
    `/api/account/reset-password/init?email=${email}`,
    setError,
    SecurityMode.NOT_SECURE,
  );
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
  setError?: (error: HttpError | string | null) => void,
) => {
  await post(
    `/api/account/change-password`,
    {
      currentPassword: currentPassword,
      newPassword: newPassword,
    },
    setError,
  );
};

export const getOrgChart = async (
  setError?: (error: HttpError | string | null) => void,
) => {
  return get<UserHierarchyDTO>(`/api/users/orgChart`, setError);
};

export const getUserHierarchy = async (
  userId: number,
  setError?: (error: HttpError | string | null) => void,
) => {
  return get<UserHierarchyDTO>(`/api/users/${userId}/hierarchy`, setError);
};
