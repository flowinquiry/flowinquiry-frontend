import { auth } from "@/auth";
import { getAccessToken } from "@/lib/access-token-manager";
import { handleError, HttpError } from "@/lib/errors";
import { PageableResult } from "@/types/commons";
import {
  createQueryParams,
  Pagination,
  paginationSchema,
  QueryDTO,
  querySchema,
} from "@/types/query";

export const fetchData = async <TData, TResponse>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  data?: TData,
  securityMode: SecurityMode = SecurityMode.CLIENT_SECURE,
  setError?: (error: string | null) => void,
): Promise<TResponse> => {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  const tokenProvider = determineTokenProvider(securityMode);
  if (tokenProvider) {
    const token = await tokenProvider();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (data instanceof FormData) {
    options.body = data;
  } else if (data !== undefined) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);

    if (response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return (await response.json()) as TResponse;
      } else {
        return undefined as unknown as TResponse;
      }
    } else {
      const error = await handleError(response, url);
      if (setError) {
        setError(error.message);
      }
      throw error;
    }
  } catch (error) {
    if (setError) {
      setError("There was a network issue. Please try again.");
    }
    throw error; // Rethrow for server-side handling
  }
};

export const getClientToken = async (): Promise<string | undefined> => {
  return getAccessToken();
};

export const getServerToken = async (): Promise<string | undefined> => {
  const session = await auth();
  return session?.user?.accessToken;
};

export const get = async <TResponse>(
  url: string,
  setError?: (error: string | null) => void,
  securityMode: SecurityMode = SecurityMode.CLIENT_SECURE,
): Promise<TResponse> => {
  return fetchData(url, "GET", undefined, securityMode, setError);
};

export const post = async <TData, TResponse>(
  url: string,
  data?: TData,
  setError?: (error: string | null) => void,
  securityMode: SecurityMode = SecurityMode.CLIENT_SECURE,
): Promise<TResponse> => {
  return fetchData(url, "POST", data, securityMode, setError);
};

export const put = async <TData, TResponse>(
  url: string,
  data?: TData,
  setError?: (error: string | null) => void,
  securityMode: SecurityMode = SecurityMode.CLIENT_SECURE,
): Promise<TResponse> => {
  return fetchData(url, "PUT", data, securityMode, setError);
};

export const deleteExec = async <TData, TResponse>(
  url: string,
  data?: TData,
  setError?: (error: string | null) => void,
  securityMode: SecurityMode = SecurityMode.CLIENT_SECURE,
): Promise<TResponse> => {
  return fetchData(url, "DELETE", data, securityMode, setError);
};

// Default pagination object
const defaultPagination: Pagination = {
  page: 1,
  size: 10,
};

const determineTokenProvider = (
  securityMode: SecurityMode,
): (() => Promise<string | undefined>) | undefined => {
  switch (securityMode) {
    case SecurityMode.CLIENT_SECURE:
      return getClientToken;
    case SecurityMode.SERVER_SECURE:
      return getServerToken;
    case SecurityMode.NOT_SECURE:
      return undefined;
    default:
      throw new Error(`Unhandled SecurityMode: ${securityMode}`);
  }
};

// Function to send a dynamic search query with pagination and URL
export const doAdvanceSearch = async <R>(
  url: string, // URL is passed as a parameter
  query: QueryDTO = { filters: [] },
  pagination: Pagination = defaultPagination,
  setError?: (error: string | null) => void,
  securityMode: SecurityMode = SecurityMode.CLIENT_SECURE,
) => {
  // Validate QueryDTO
  const queryValidation = querySchema.safeParse(query);
  if (!queryValidation.success) {
    throw new HttpError(
      HttpError.BAD_REQUEST,
      `Invalid query ${JSON.stringify(query)}. Root cause is ${JSON.stringify(queryValidation.error.errors)}`,
    );
  }

  // Validate pagination
  const paginationValidation = paginationSchema.safeParse(pagination);
  if (!paginationValidation.success) {
    throw new HttpError(
      HttpError.BAD_REQUEST,
      `Invalid pagination ${JSON.stringify(paginationValidation.error.errors)}`,
    );
  }

  const queryParams = createQueryParams(pagination);

  return fetchData<QueryDTO, PageableResult<R>>(
    `${url}?${queryParams.toString()}`,
    "POST",
    query,
    securityMode,
    setError,
  );
};

export enum SecurityMode {
  NOT_SECURE = "NOT_SECURE",
  CLIENT_SECURE = "CLIENT_SECURE",
  SERVER_SECURE = "SERVER_SECURE",
}
