"use client";

import {
  EntitiesDeleteDialog,
  RowEntitiesDeleteDialogProps,
} from "@/components/shared/table-entity-delete-dialog";
import { AccountDTO } from "@/types/accounts";

export function AccountDeleteDialog({
  ...props
}: RowEntitiesDeleteDialogProps<AccountDTO>) {
  return EntitiesDeleteDialog<AccountDTO>({
    ...props,
  });
}
