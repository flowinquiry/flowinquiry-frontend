// HttpError definition
export class HttpError extends Error {
  public status: number;
  public handled: boolean;

  static BAD_REQUEST = 400;
  static UNAUTHORIZED = 401;
  static FORBIDDEN = 403;
  static NOT_FOUND = 404;
  static INTERNAL_SERVER_ERROR = 500;

  constructor(status: number, message: string, handled: boolean = false) {
    super(message);
    this.status = status;
    this.handled = handled;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

const STATUS_MESSAGES: Record<number, string> = {
  400: "Bad request. Please check your input.",
  401: "Unauthorized access. Please log in.",
  403: "Forbidden. You do not have permission to perform this action.",
  404: "Resource not found. Please try again later.",
  409: "Conflict. The request could not be completed due to a conflict.",
  500: "Server error. Please try again later.",
  503: "Service unavailable. Please try again later.",
};

// Utility method to handle HTTP errors
export const handleError = async (
  response: Response,
  url: string,
): Promise<HttpError> => {
  let details: string | undefined;

  try {
    // Attempt to parse the response body for details
    if (response.headers.get("content-type")?.includes("application/json")) {
      const errorBody = await response.json();
      details = errorBody.message || JSON.stringify(errorBody);
    } else {
      details = await response.text();
    }
  } catch {
    // If parsing fails, fallback to response.statusText
    details = response.statusText || "No additional details available.";
  }

  // Retrieve the error message from the map or use a default
  const errorMessage =
    STATUS_MESSAGES[response.status] ||
    `Unexpected error (status: ${response.status}).`;

  // Log the error for debugging
  console.error(`Error fetching ${url}:`, {
    status: response.status,
    errorMessage,
    details,
  });

  return new HttpError(
    response.status,
    `${errorMessage} Details: ${details}`,
    true,
  );
};
