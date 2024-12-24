/**
 * The backend url that nextjs server side initiates the request to FlowInquiry backend service
 */
let backendUrl: string | null = null;

/**
 * The base URL is the address that the Next.js client-side uses to initiate requests to the FlowInquiry service. Note that the
 * base URL and the back-end URL are significantly different. The base URL is accessible from the client side, enabling API communication,
 * while the back-end URL might only be accessible within the FlowInquiry cluster and not directly exposed to the client.
 */
let baseUrl: string | undefined = undefined;

// Function to set the `BACKEND_API`
export const setBackendUrl = (url: string) => {
  backendUrl = url;
};

export const setBaseUrl = (url?: string) => {
  baseUrl = url;
};

// Function to initialize `BASE_URL` on the client
export const initializeBaseUrlOnClient = () => {
  if (typeof window !== "undefined" && window.BASE_URL) {
    setBaseUrl(window.BASE_URL);
  } else {
    console.warn("Base url API is not defined on the client.");
  }
};

// Function to get the `BACKEND_URL`
export const getBackendUrl = (): string => {
  return backendUrl!;
};

export const getBaseUrl = (): string | undefined => {
  return baseUrl;
};

export const getApiUrl = () => {
  const baseUrl = getBaseUrl();
  return baseUrl ? baseUrl : getBackendUrl();
};
