import { redirect } from "next/navigation";

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
  authToken?: string,
  data?: TData,
): Promise<TResponse> => {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  // Conditionally add Authorization header if authToken is presented
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
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
    if (response.status === 401 && authToken) {
      console.log(
        `Try to access ${url} that returned 401. Redirecting to the login page.`,
      );
      redirect("/login");
    }
    await handleError(response, url);

    // Add unreachable return statement for TypeScript type safety
    return Promise.reject("Unreachable code: handleError should throw");
  }
};

export const get = async <TResponse>(
  url: string,
  authToken?: string,
): Promise<TResponse> => {
  return fetchData(url, "GET", authToken, undefined);
};

export const post = async <TData, TResponse>(
  url: string,
  authToken?: string,
  data?: TData,
): Promise<TResponse> => {
  return fetchData(url, "POST", authToken, data);
};

export const put = async <TData, TResponse>(
  url: string,
  authToken?: string,
  data?: TData,
): Promise<TResponse> => {
  return fetchData(url, "PUT", authToken, data);
};

export const deleteExec = async <TData, TResponse>(
  url: string,
  authToken?: string,
  data?: TData,
): Promise<TResponse> => {
  return fetchData(url, "DELETE", authToken, data);
};

// Default pagination object
const defaultPagination: Pagination = {
  page: 1,
  size: 10,
};

// Function to send a dynamic search query with pagination and URL
export const doAdvanceSearch = async <R>(
  url: string, // URL is passed as a parameter
  authToken?: string,
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
    authToken,
    query, // Pass the QueryDTO directly in the body
  );
};
