"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { AccountTableRowActions } from "@/components/accounts/account-table-cell-action";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDateTime, formatDateTimeDistanceToNow } from "@/lib/datetime";
import { obfuscate } from "@/lib/endecode";
import { AccountDTO } from "@/types/accounts";

export const accounts_columns_def: ColumnDef<AccountDTO>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Button variant="link" className="px-0" asChild>
          <Link href={`/portal/accounts/${obfuscate(row.original.id!)}`}>
            {row.getValue("name")}
          </Link>
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">{row.getValue("type")}</div>
    ),
  },
  {
    accessorKey: "industry",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Industry" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">{row.getValue("industry")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "parentAccountName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Parent" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        {row.original.parentAccountId ? (
          <Button variant="link" className="px-0" asChild>
            <Link
              href={`/portal/accounts/${obfuscate(row.original.parentAccountId)}`}
            >
              {row.getValue("parentAccountName")}
            </Link>
          </Button>
        ) : (
          <div></div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const field = new Date(row.getValue("createdAt"));
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              {formatDateTimeDistanceToNow(field)}
            </TooltipTrigger>
            <TooltipContent>
              <p>{formatDateTime(field)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <AccountTableRowActions row={row} />,
    size: 40,
  },
];
