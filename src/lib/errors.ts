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

// Utility method to handle HTTP errors
export const handleError = async (
  response: Response,
  url: string,
): Promise<HttpError> => {
  let errorMessage = "An unexpected error occurred.";
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

  // Customize the error message based on the status code
  switch (response.status) {
    case HttpError.BAD_REQUEST:
      errorMessage = "Bad request. Please check your input.";
      break;
    case HttpError.UNAUTHORIZED:
      errorMessage = details || "Unauthorized access.";
      break;
    case HttpError.FORBIDDEN:
      errorMessage =
        "Forbidden. You do not have permission to perform this action.";
      break;
    case HttpError.NOT_FOUND:
      errorMessage = "Resource not found. Please try again later.";
      break;
    case HttpError.INTERNAL_SERVER_ERROR:
      errorMessage = "Server error. Please try again later.";
      break;
    case 503:
      errorMessage = "Service unavailable. Please try again later.";
      break;
    default:
      errorMessage = `Unexpected error (status: ${response.status}).`;
      break;
  }

  // Append the details to the error message if available
  // if (details) {
  //   errorMessage += ` Details: ${details}`;
  // }

  // Log the error for debugging
  console.error(`Error fetching ${url}:`, {
    status: response.status,
    errorMessage,
    details,
  });

  return new HttpError(response.status, errorMessage, true);
};
