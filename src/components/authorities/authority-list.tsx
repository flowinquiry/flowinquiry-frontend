"use client";

import React, { useEffect, useState } from "react";

import { AuthorityDTO } from "@/types/authorities";

export function AuthoritiesView() {
  const [data, setData] = useState<Array<AuthorityDTO>>([]);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthorities = async () => {
      try {
        setLoading(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorities();
  }, []);

  return <div>Authorities</div>;
}
