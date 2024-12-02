"use server";

import { redirect } from "next/navigation";

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
  isAuthorized: boolean = true,
): Promise<TResponse> => {
  const session = isAuthorized ? await auth() : null;
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };
  // Conditionally add Authorization header if isAuthorized is true
  if (isAuthorized && session?.user?.accessToken) {
    headers.Authorization = `Bearer ${session.user.accessToken}`;
  }

  const response = await fetch(url, {
    method: method,
    headers: headers,
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
    // Unauthorized access
    if (response.status === 401 && isAuthorized) {
      redirect("/login");
    }
    await handleError(response, url);

    // Add unreachable return statement for TypeScript type safety
    return Promise.reject("Unreachable code: handleError should throw");
  }
};

export const get = async <TResponse>(
  url: string,
  isAuthorized: boolean = true,
): Promise<TResponse> => {
  return fetchData(url, "GET", undefined, isAuthorized);
};

export const post = async <TData, TResponse>(
  url: string,
  data?: TData,
  isAuthorized: boolean = true,
): Promise<TResponse> => {
  return fetchData(url, "POST", data, isAuthorized);
};

export const put = async <TData, TResponse>(
  url: string,
  data?: TData,
  isAuthorized: boolean = true,
): Promise<TResponse> => {
  return fetchData(url, "PUT", data, isAuthorized);
};

export const deleteExec = async <TData, TResponse>(
  url: string,
  data?: TData,
  isAuthorized: boolean = true,
): Promise<TResponse> => {
  return fetchData(url, "DELETE", data, isAuthorized);
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
    query, // Pass the QueryDTO directly in the body
  );
};
