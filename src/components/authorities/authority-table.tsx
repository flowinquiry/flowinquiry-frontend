"use client";

import React, { useEffect, useState } from "react";

import { authorities_columns_def } from "@/components/authorities/authority-table-columns";
import { AuthoritiesTableToolbarActions } from "@/components/authorities/authority-table-toolbar-actions";
import { DataTable } from "@/components/ui/table/data-table";
import { DataTableToolbar } from "@/components/ui/table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { getAuthorities } from "@/lib/actions/authorities.action";
import { AuthorityDTO } from "@/types/authorities";
import { DataTableFilterField } from "@/types/table";

interface AuthorityTableProps {
  authoritiesPromise: ReturnType<typeof getAuthorities>;
  enableAdvancedFilter: boolean;
}

export function AuthoritiesTable({
  authoritiesPromise,
  enableAdvancedFilter = false,
}: AuthorityTableProps) {
  const [data, setData] = useState<Array<AuthorityDTO>>([]);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthorities = async () => {
      try {
        setLoading(true);
        const pageResult = await authoritiesPromise;
        setData(pageResult?.content);
        setPageCount(pageResult?.totalPages);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorities();
  }, [authoritiesPromise]);

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo(() => authorities_columns_def, []);

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
  const filterFields: DataTableFilterField<AuthorityDTO>[] = [
    {
      label: "Name",
      id: "name",
      placeholder: "Filter names...",
    },
  ];

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
    enableAdvancedFilter: enableAdvancedFilter,
    initialState: {
      sorting: [{ id: "name", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow, index) => `${originalRow.name}-${index}`,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <DataTable table={table} floatingBar={null}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <AuthoritiesTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  );
}
