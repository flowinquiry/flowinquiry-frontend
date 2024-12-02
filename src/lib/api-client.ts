export async function apiClient<T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: FormData | object,
  authToken?: string,
): Promise<T> {
  const headers: HeadersInit = {
    "Access-Control-Allow-Origin": "*",
  };

  // Add the Authorization header if authToken is provided
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  // Configure the request options
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

  // Make the fetch request
  const response = await fetch(url, options);

  // Handle responses, optionally parse JSON if needed
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return (await response.json()) as T;
}
