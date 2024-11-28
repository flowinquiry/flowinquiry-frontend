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
): Promise<void> => {
  let errorMessage = undefined;
  try {
    // Check if there's a body to parse based on Content-Length or status
    if (
      response.headers.get("Content-Length") !== "0" &&
      response.status !== 204
    ) {
      const errorDetails = await response.json(); // Attempt to parse JSON
      errorMessage = errorDetails.message || errorMessage;
    }
  } catch (error) {
    errorMessage = "Failed to parse error details from response";
  }

  switch (response.status) {
    case HttpError.UNAUTHORIZED:
      throw new HttpError(
        HttpError.UNAUTHORIZED,
        `Error at ${url}: ${errorMessage || "Unauthorized"}`,
      );
    case HttpError.BAD_REQUEST:
      throw new HttpError(
        HttpError.BAD_REQUEST,
        `Error at ${url}: ${errorMessage || "Bad request"}`,
      );

    case HttpError.NOT_FOUND:
      throw new HttpError(
        HttpError.NOT_FOUND,
        `Error at ${url}: ${errorMessage || "Not Found"}`,
      );
    case HttpError.INTERNAL_SERVER_ERROR:
      throw new HttpError(
        HttpError.INTERNAL_SERVER_ERROR,
        `Error at ${url}: ${errorMessage || "Internal Server Error"}`,
      );
    default:
      throw new HttpError(
        response.status,
        errorMessage || "An unknown error occurred",
      );
  }
};
