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
  getToken?: () => Promise<string | undefined>,
): Promise<TResponse> => {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  const token = getToken ? await getToken() : undefined;
  if (getToken) {
    const token = await getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  // Prepare the body and headers based on data type
  const options: RequestInit = {
    method,
    headers,
  };
  if (data instanceof FormData) {
    options.body = data;
    // Do not set Content-Type header; fetch automatically handles it for FormData
  } else if (data !== undefined) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

  if (response.ok) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return (await response.json()) as TResponse;
    } else {
      return undefined as unknown as TResponse;
    }
  } else {
    await handleError(response, url);

    // Add unreachable return statement for TypeScript type safety
    return Promise.reject("Unreachable code: handleError should throw");
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
  securityMode: SecurityMode = SecurityMode.CLIENT_SECURE,
): Promise<TResponse> => {
  const tokenProvider = determineTokenProvider(securityMode);
  return fetchData(url, "GET", undefined, tokenProvider);
};

export const post = async <TData, TResponse>(
  url: string,
  data?: TData,
  securityMode: SecurityMode = SecurityMode.CLIENT_SECURE,
): Promise<TResponse> => {
  const tokenProvider = determineTokenProvider(securityMode);
  return fetchData(url, "POST", data, tokenProvider);
};

export const put = async <TData, TResponse>(
  url: string,
  data?: TData,
  securityMode: SecurityMode = SecurityMode.CLIENT_SECURE,
): Promise<TResponse> => {
  const tokenProvider = determineTokenProvider(securityMode);
  return fetchData(url, "PUT", data, tokenProvider);
};

export const deleteExec = async <TData, TResponse>(
  url: string,
  data?: TData,
  securityMode: SecurityMode = SecurityMode.CLIENT_SECURE,
): Promise<TResponse> => {
  const tokenProvider = determineTokenProvider(securityMode);
  return fetchData(url, "DELETE", data, tokenProvider);
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
  pagination: Pagination = defaultPagination, // Default pagination with page 1 and size 10
  isClient: boolean = true,
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

  const tokenProvider = isClient ? getClientToken : getServerToken;

  return fetchData<QueryDTO, PageableResult<R>>(
    `${url}?${queryParams.toString()}`,
    "POST",
    query,
    tokenProvider,
  );
};

export enum SecurityMode {
  NOT_SECURE = "NOT_SECURE",
  CLIENT_SECURE = "CLIENT_SECURE",
  SERVER_SECURE = "SERVER_SECURE",
}
