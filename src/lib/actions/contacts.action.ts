"use server";

import { redirect } from "next/navigation";

import { doAdvanceSearch, get, post, put } from "@/lib/actions/commons.action";
import { findEntitiesFilterOptions } from "@/lib/actions/shared.action";
import { BACKEND_API } from "@/lib/constants";
import { EntityValueDefinition, PageableResult } from "@/types/commons";
import { ConTactDTO, ContactDTOSchema } from "@/types/contacts";
import { Filter } from "@/types/query";

export const findContactById = async (
  contactId: number,
): Promise<ConTactDTO> => {
  return get<ConTactDTO>(`${BACKEND_API}/api/crm/contacts/${contactId}`);
};

export const findContactsByAccountId = async (
  accountId: number,
): Promise<PageableResult<ConTactDTO>> => {
  return get<PageableResult<ConTactDTO>>(
    `${BACKEND_API}/api/crm/contacts/account/${accountId}`,
  );
};

export const findContactStatuses = async (): Promise<
  Array<EntityValueDefinition>
> => {
  return get<Array<EntityValueDefinition>>(
    `${BACKEND_API}/api/crm/values?entityType=contact&&valueKey=status`,
  );
};

export const findContactStatusesFilterOptions = async () => {
  return findEntitiesFilterOptions(findContactStatuses);
};

export async function searchContacts(filters: Filter[]) {
  return doAdvanceSearch<ConTactDTO>(
    `${BACKEND_API}/api/crm/contacts/search`,
    filters,
  );
}

export const saveOrUpdateContact = async (
  isEdit: boolean,
  contact: ConTactDTO,
): Promise<void> => {
  const validation = ContactDTOSchema.safeParse(contact);

  if (validation.success) {
    if (isEdit) {
      await put<ConTactDTO, string>(
        `${BACKEND_API}/api/crm/contacts/${contact.id}`,
        contact,
      );
    } else {
      await post<ConTactDTO, string>(
        `${BACKEND_API}/api/crm/contacts`,
        contact,
      );
    }

    redirect("/portal/contacts");
  }
};

export const findPreviousContact = async (contactId: number) => {
  return get<ConTactDTO>(
    `${BACKEND_API}/api/crm/contacts/previous/${contactId}`,
  );
};

export const findNextContact = async (contactId: number) => {
  return get<ConTactDTO>(`${BACKEND_API}/api/crm/contacts/next/${contactId}`);
};
