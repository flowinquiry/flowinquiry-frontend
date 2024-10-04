"use client";

import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

// import { priority_options, status_options } from "../filters"
import { Button } from "@/components/ui/button";
import { DataTableViewOptions } from "@/components/ui/ext-data-table-view-options";
import { Input } from "@/components/ui/input";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter accounts..."
          value={
            (table.getColumn("accountName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("accountName")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {/*{table.getColumn("status") && (*/}
        {/*    <DataTableFacetedFilter*/}
        {/*        column={table.getColumn("status")}*/}
        {/*        title="Status"*/}
        {/*        options={status_options}*/}
        {/*    />*/}
        {/*)}*/}
        {/*{table.getColumn("priority") && (*/}
        {/*    <DataTableFacetedFilter*/}
        {/*        column={table.getColumn("priority")}*/}
        {/*        title="Priority"*/}
        {/*        options={priority_options}*/}
        {/*    />*/}
        {/*)}*/}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}