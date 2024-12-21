export class HttpError extends Error {
  public status: number;

  static BAD_REQUEST = 400;
  static UNAUTHORIZED = 401;
  static FORBIDDEN = 403;
  static NOT_FOUND = 404;
  static INTERNAL_SERVER_ERROR = 500;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

// Utility method to handle HTTP errors
export const handleError = async (
  response: Response,
  url: string,
): Promise<Error> => {
  let errorMessage = "An unexpected error occurred.";
  let details: string | undefined;

  if (response.headers.get("content-type")?.includes("application/json")) {
    const errorBody = await response.json();
    details = errorBody.message || JSON.stringify(errorBody);
  } else {
    details = await response.text();
  }

  switch (response.status) {
    case 400:
      errorMessage = "Bad request. Please check your input.";
      break;
    case 401:
      errorMessage = "Unauthorized. Please log in and try again.";
      break;
    case 403:
      errorMessage =
        "Forbidden. You do not have permission to perform this action.";
      break;
    case 404:
      errorMessage = "Resource not found. Please try again later.";
      break;
    case 500:
      errorMessage = "Server error. Please try again later.";
      break;
    case 503:
      errorMessage = "Service unavailable. Please try again later.";
      break;
    default:
      errorMessage = `Unexpected error (status: ${response.status}).`;
      break;
  }

  console.error(`Error fetching ${url}:`, {
    status: response.status,
    details,
  });

  // Return an Error object with the errorMessage
  return new Error(errorMessage);
};
