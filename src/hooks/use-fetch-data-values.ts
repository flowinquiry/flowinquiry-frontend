"use client";

import React from "react";

import { EntityValueDefinition } from "@/types/commons";

// Generic hook to load data
export const useFetchData = (
  fetchData: () => Promise<Array<EntityValueDefinition>>,
) => {
  const [items, setItems] = React.useState<Array<string>>([]);

  const loadItems = React.useCallback(async () => {
    const data = await fetchData();
    if (data) {
      setItems(data.map((it) => it.value)); // Apply transformation to the fetched data
    }
  }, [fetchData]);

  React.useEffect(() => {
    loadItems();
  }, [loadItems]);

  return items;
};
