import { Row } from "@tanstack/react-table";

import { DataTableConfig } from "@/config/data-table";

export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
}

export type ColumnType = DataTableConfig["columnTypes"][number];

export type FilterOperator = DataTableConfig["globalOperators"][number];

export type JoinOperator = DataTableConfig["joinOperators"][number]["value"];

export interface DataTableFilterField<TData> {
  id: keyof TData;
  label: string;
  placeholder?: string;
  options?: Option[];
}

export interface FilterCondition<TData> {
  id: keyof TData;
  value: string | string[];
  type: ColumnType;
  operator: FilterOperator;
}

export interface DataTableAdvancedFilterField<TData>
  extends DataTableFilterField<TData> {
  type: ColumnType;
}

export interface DataTableRowAction<TData> {
  row: Row<TData>;
  type: "update" | "delete";
}
