import { unstable_noStore as noStore } from "next/dist/server/web/spec-extension/unstable-no-store";

import {
  deleteExec,
  doAdvanceSearch,
  get,
  post,
  put,
  SecurityMode,
} from "@/lib/actions/commons.action";
import { BACKEND_API } from "@/lib/constants";
import { Pagination, QueryDTO } from "@/types/query";
import { UserDTO, UserHierarchyDTO } from "@/types/users";

export async function searchUsers(
  query: QueryDTO,
  pagination: Pagination,
  setError?: (error: string | null) => void,
) {
  noStore();
  return doAdvanceSearch<UserDTO>(
    `${BACKEND_API}/api/users/search`,
    query,
    pagination,
    setError,
  );
}

export const getDirectReports = async (
  userId: number,
  setError?: (error: string | null) => void,
) => {
  return get<Array<UserDTO>>(
    `${BACKEND_API}/api/users/${userId}/direct-reports`,
    setError,
  );
};

export const findUserById = async (
  userId: number,
  setError?: (error: string | null) => void,
) => {
  return get<UserDTO>(`${BACKEND_API}/api/users/${userId}`, setError);
};

export const createUser = async (
  user: UserDTO,
  setError?: (error: string | null) => void,
) => {
  if (user.id) {
    const formData = new FormData();
    const userJsonBlob = new Blob([JSON.stringify(user)], {
      type: "application/json",
    });
    formData.append("userDTO", userJsonBlob);
    return put<FormData, UserDTO>(
      `${BACKEND_API}/api/users`,
      formData,
      setError,
    );
  } else {
    return post<UserDTO, UserDTO>(`${BACKEND_API}/api/users`, user, setError);
  }
};

export const deleteUser = async (
  userId: number,
  setError?: (error: string | null) => void,
) => {
  return deleteExec(`${BACKEND_API}/api/users/${userId}`, setError);
};

export const resendActivationEmail = async (
  email: string,
  setError?: (error: string | null) => void,
) => {
  return get(`${BACKEND_API}/api/${email}/resend-activation-email`, setError);
};

export const passwordReset = async (
  key: string,
  password: string,
  setError?: (error: string | null) => void,
) => {
  await post(
    `${BACKEND_API}/api/account/reset-password/finish`,
    { key: key, newPassword: password },
    setError,
    SecurityMode.NOT_SECURE,
  );
};

export const forgotPassword = async (
  email: string,
  setError?: (error: string | null) => void,
) => {
  await get(
    `${BACKEND_API}/api/account/reset-password/init?email=${email}`,
    setError,
    SecurityMode.NOT_SECURE,
  );
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
  setError?: (error: string | null) => void,
) => {
  await post(
    `${BACKEND_API}/api/account/change-password`,
    {
      currentPassword: currentPassword,
      newPassword: newPassword,
    },
    setError,
  );
};

export const getOrgChart = async (
  setError?: (error: string | null) => void,
) => {
  return get<UserHierarchyDTO>(`${BACKEND_API}/api/users/orgChart`, setError);
};

export const getUserHierarchy = async (
  userId: number,
  setError?: (error: string | null) => void,
) => {
  return get<UserHierarchyDTO>(
    `${BACKEND_API}/api/users/${userId}/hierarchy`,
    setError,
  );
};
