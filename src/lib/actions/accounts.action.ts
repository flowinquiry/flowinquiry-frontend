"use server";

import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";

import {
  deleteExec,
  doAdvanceSearch,
  get,
  post,
  put,
} from "@/lib/actions/commons.action";
import { findEntitiesFilterOptions } from "@/lib/actions/shared.action";
import { BACKEND_API } from "@/lib/constants";
import {
  AccountDTO,
  AccountDTOSchema,
  AccountSearchParams,
} from "@/types/accounts";
import { EntityValueDefinition, PageableResult } from "@/types/commons";

export const findAccounts = async (): Promise<PageableResult<AccountDTO>> => {
  return get<PageableResult<AccountDTO>>(`${BACKEND_API}/api/crm/accounts`);
};

export const findAccountStatuses = async (): Promise<
  Array<EntityValueDefinition>
> => {
  return get<Array<EntityValueDefinition>>(
    `${BACKEND_API}/api/crm/values?entityType=account&&valueKey=status`,
  );
};

export const findAccountStatusesFilterOptions = async () => {
  return findEntitiesFilterOptions(findAccountStatuses);
};

export const findAccountTypes = async (): Promise<
  Array<EntityValueDefinition>
> => {
  return get<Array<EntityValueDefinition>>(
    `${BACKEND_API}/api/crm/values?entityType=account&&valueKey=type`,
  );
};

export const findAccountTypesFilterOptions = async () => {
  return findEntitiesFilterOptions(findAccountTypes);
};

export const findAccountIndustries = async (): Promise<
  Array<EntityValueDefinition>
> => {
  return get<Array<EntityValueDefinition>>(
    `${BACKEND_API}/api/crm/values?entityType=account&&valueKey=industry`,
  );
};

export const findAccountIndustriesFilterOptions = async () => {
  return findEntitiesFilterOptions(findAccountIndustries);
};

export const saveOrUpdateAccount = async (
  isEdit: boolean,
  account: AccountDTO,
): Promise<void> => {
  const validation = AccountDTOSchema.safeParse(account);

  if (validation.success) {
    if (isEdit) {
      await put<AccountDTO, string>(
        `${BACKEND_API}/api/crm/accounts/${account.id}`,
        account,
      );
    } else {
      await post<AccountDTO, string>(
        `${BACKEND_API}/api/crm/accounts`,
        account,
      );
    }
    redirect("/portal/accounts");
  }
};

export const findAccountById = async (accountId: number) => {
  return get<AccountDTO>(`${BACKEND_API}/api/crm/accounts/${accountId}`);
};

export const findPreviousAccount = async (accountId: number) => {
  return get<AccountDTO>(
    `${BACKEND_API}/api/crm/accounts/${accountId}/previous`,
  );
};

export const findNextAccount = async (accountId: number) => {
  return get<AccountDTO>(`${BACKEND_API}/api/crm/accounts/${accountId}/next`);
};

export async function searchAccounts(input: AccountSearchParams) {
  noStore();
  return doAdvanceSearch<AccountDTO>(`${BACKEND_API}/api/crm/accounts/search`);
}

export async function deleteAccounts(ids: number[]) {
  revalidatePath("/");

  return deleteExec(`${BACKEND_API}/api/crm/accounts`, ids).then(() => {});
}
