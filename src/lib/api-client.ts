export async function apiClient<T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: FormData | object,
  authToken?: string,
): Promise<T> {
  const headers: HeadersInit = {
    "Access-Control-Allow-Origin": "*",
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  // Set the body depending on content type
  if (body) {
    if (body instanceof FormData) {
      options.body = body;
    } else {
      headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return (await response.json()) as T;
}
