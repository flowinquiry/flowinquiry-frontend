import { unstable_noStore as noStore } from "next/dist/server/web/spec-extension/unstable-no-store";

import { doAdvanceSearch, get, post, put } from "@/lib/actions/commons.action";
import { BACKEND_API } from "@/lib/constants";
import { Pagination, QueryDTO } from "@/types/query";
import { UserDTO } from "@/types/users";

export async function searchUsers(query: QueryDTO, pagination: Pagination) {
  noStore();
  return doAdvanceSearch<UserDTO>(
    `${BACKEND_API}/api/users/search`,
    query,
    pagination,
  );
}

export const getDirectReports = async (userId: number) => {
  return get<Array<UserDTO>>(
    `${BACKEND_API}/api/users/${userId}/direct-reports`,
  );
};

export const findUserById = async (userId: number) => {
  return get<UserDTO>(`${BACKEND_API}/api/users/${userId}`);
};

export const createUser = async (user: UserDTO) => {
  if (user.id) {
    const formData = new FormData();
    const userJsonBlob = new Blob([JSON.stringify(user)], {
      type: "application/json",
    });
    formData.append("userDTO", userJsonBlob);
    return put<FormData, UserDTO>(`${BACKEND_API}/api/users`, formData);
  } else {
    return post<UserDTO, UserDTO>(`${BACKEND_API}/api/admin/users`, user);
  }
};

export const passwordReset = async (key: string, password: string) => {
  await post(
    `${BACKEND_API}/api/account/reset-password/finish`,
    { key: key, newPassword: password },
    false,
  );
};

export const forgotPassword = async (email: string) => {
  await get(
    `${BACKEND_API}/api/account/reset-password/init?email=${email}`,
    false,
  );
};
