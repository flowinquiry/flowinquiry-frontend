"use client";

import { type Table } from "@tanstack/react-table";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { exportTableToCSV } from "@/lib/export";
import { ConTactDTO } from "@/types/contacts";

interface ContactsTableToolbarActionsProps {
  table: Table<ConTactDTO>;
}

export function ContactsTableToolbarActions({
  table,
}: ContactsTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "contacts",
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
