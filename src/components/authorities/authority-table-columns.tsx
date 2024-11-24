"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { AuthorityTableRowActions } from "@/components/authorities/authority-table-cell-action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";
import { obfuscate } from "@/lib/endecode";
import { AuthorityDTO } from "@/types/authorities";

export const authorities_columns_def: ColumnDef<AuthorityDTO>[] = [
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
    accessorKey: "descriptiveName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const isSystemLabel = row.original.systemRole;

      return (
        <div className="flex space-x-2">
          {isSystemLabel && <Badge variant="outline">System</Badge>}
          <Button variant="link" className="px-0" asChild>
            <Link
              href={`/portal/settings/authorities/${obfuscate(row.original.name!)}`}
            >
              {row.getValue("descriptiveName")}
            </Link>
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => <div>{row.getValue("description")}</div>,
    enableSorting: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <AuthorityTableRowActions row={row} />,
  },
];
