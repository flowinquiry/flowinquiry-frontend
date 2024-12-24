"use client";

import { useEffect } from "react";

import { initializeBaseUrlOnClient } from "@/lib/runtime-variables";

const AutoInitBackendApi = () => {
  useEffect(() => {
    initializeBaseUrlOnClient();
  }, []);

  return null; // This component is only for initialization
};

export default AutoInitBackendApi;
