"use client";

import React from "react";

import { accounts_columns_def } from "@/components/accounts/account-table-columns";
import { AccountsTableToolbarActions } from "@/components/accounts/account-table-toolbar-actions";
import { DataTable } from "@/components/ui/table/data-table";
import { DataTableToolbar } from "@/components/ui/table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { useFetchData } from "@/hooks/use-fetch-data-values";
import {
  findAccountIndustries,
  findAccountStatuses,
  findAccountTypes,
  searchAccounts,
} from "@/lib/actions/accounts.action";
import { AccountDTO } from "@/types/accounts";
import { DataTableFilterField } from "@/types/table";

interface AccountsTableProps {
  accountsPromise: ReturnType<typeof searchAccounts>;
  enableAdvancedFilter: boolean;
}

export function AccountsTable({
  accountsPromise,
  enableAdvancedFilter = false,
}: AccountsTableProps) {
  const { content: data, totalPages: pageCount } = React.use(accountsPromise);
  const columns = React.useMemo(() => accounts_columns_def, []);

  const accountStatuses = useFetchData(findAccountStatuses);
  const accountTypes = useFetchData(findAccountTypes);
  const accountIndustries = useFetchData(findAccountIndustries);

  /**
   * This component can render either a faceted filter or a search filter based on the `options` prop.
   *
   * @prop options - An array of objects, each representing a filter option. If provided, a faceted filter is rendered. If not, a search filter is rendered.
   *
   * Each `option` object has the following properties:
   * @prop {string} label - The label for the filter option.
   * @prop {string} value - The value for the filter option.
   * @prop {React.ReactNode} [icon] - An optional icon to display next to the label.
   * @prop {boolean} [withCount] - An optional boolean to display the count of the filter option.
   */
  const filterFields: DataTableFilterField<AccountDTO>[] = [
    {
      id: "name",
      label: "Name",
      placeholder: "Filter names...",
    },
    // {
    //   id: "type",
    //   label: "Type",
    //   options: accountTypes.map((type) => ({
    //     label: type,
    //     value: type,
    //     icon: undefined,
    //     withCount: true,
    //   })),
    // },
    // {
    //   id: "industry",
    //   label: "Industry",
    //   options: accountIndustries.map((industry) => ({
    //     label: industry,
    //     value: industry,
    //     icon: undefined,
    //     withCount: true,
    //   })),
    // },
    // {
    //   id: "status",
    //   label: "Status",
    //   options: accountStatuses.map((status) => ({
    //     label: status,
    //     value: status,
    //     icon: undefined,
    //     withCount: true,
    //   })),
    // },
  ];

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
    enableAdvancedFilter: enableAdvancedFilter,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <DataTable table={table} floatingBar={null}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <AccountsTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
