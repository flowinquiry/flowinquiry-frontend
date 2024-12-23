"use client";

import { useEffect } from "react";

import { initializeBackendApiOnClient } from "@/lib/runtime-variables";

const AutoInitBackendApi = () => {
  useEffect(() => {
    initializeBackendApiOnClient();
  }, []);

  return null; // This component is only for initialization
};

export default AutoInitBackendApi;
