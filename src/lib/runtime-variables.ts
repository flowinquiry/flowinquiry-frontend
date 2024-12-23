let backendApi: string | null = null;

// Function to set the `BACKEND_API`
export const setBackendApi = (api: string) => {
  backendApi = api;
};

// Function to initialize `BACKEND_API` on the client
export const initializeBackendApiOnClient = () => {
  if (typeof window !== "undefined" && window.BACKEND_API) {
    setBackendApi(window.BACKEND_API);
  } else {
    console.error("Backend API is not defined on the client.");
  }
};

// Function to get the `BACKEND_API`
export const getBackendApi = (): string => {
  return backendApi!;
};
