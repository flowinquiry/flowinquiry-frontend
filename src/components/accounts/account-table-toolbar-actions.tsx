"use client";

import { type Table } from "@tanstack/react-table";
import { Download } from "lucide-react";

import { AccountDeleteDialog } from "@/components/accounts/account-delete-dialog";
import { Button } from "@/components/ui/button";
import { deleteAccounts } from "@/lib/actions/accounts.action";
import { exportTableToCSV } from "@/lib/export";
import { AccountDTO } from "@/types/accounts";

interface AccountTableToolbarActionsProps {
  table: Table<AccountDTO>;
}

export function AccountsTableToolbarActions({
  table,
}: AccountTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <AccountDeleteDialog
          entities={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
          entityName="Account"
          deleteEntitiesFn={deleteAccounts}
        />
      ) : null}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "accounts",
            excludeColumns: ["select", "actions"],
          })
        }
        className="gap-2"
      >
        <Download className="size-4" aria-hidden="true" />
        Export
      </Button>
    </div>
  );
}
