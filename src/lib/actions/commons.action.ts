import { getSession } from "next-auth/react";

import { auth } from "@/auth";
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
    "Content-Type": "application/json",
  };

  if (getToken) {
    const token = await getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    method,
    headers,
    ...(data && { body: JSON.stringify(data) }),
  });

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
  const session = await getSession();
  return session?.user?.accessToken;
};

export const getServerToken = async (): Promise<string | undefined> => {
  const session = await auth();
  return session?.user?.accessToken;
};

export const get = async <TResponse>(
  url: string,
  isClient: boolean = true,
): Promise<TResponse> => {
  const tokenProvider = isClient ? getClientToken : getServerToken;
  return fetchData(url, "GET", undefined, tokenProvider);
};

export const post = async <TData, TResponse>(
  url: string,
  data?: TData,
  isClient: boolean = true,
): Promise<TResponse> => {
  const tokenProvider = isClient ? getClientToken : getServerToken;
  return fetchData(url, "POST", data, tokenProvider);
};

export const put = async <TData, TResponse>(
  url: string,
  data?: TData,
  isClient: boolean = true,
): Promise<TResponse> => {
  const tokenProvider = isClient ? getClientToken : getServerToken;
  return fetchData(url, "PUT", data, tokenProvider);
};

export const deleteExec = async <TData, TResponse>(
  url: string,
  data?: TData,
  isClient: boolean = true,
): Promise<TResponse> => {
  const tokenProvider = isClient ? getClientToken : getServerToken;
  return fetchData(url, "DELETE", data, tokenProvider);
};

// Default pagination object
const defaultPagination: Pagination = {
  page: 1,
  size: 10,
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
