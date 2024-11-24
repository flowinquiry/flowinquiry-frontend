// Function to encode any string to be safe for use in URLs
export const safeUrlEncode = (value: string): string => {
  return encodeURIComponent(value);
};

// Function to decode a URL-safe string back to its original form
export const safeUrlDecode = (value: string): string => {
  return decodeURIComponent(value);
};

// Function to obfuscate/encode the value (handles both string and number)
export const obfuscate = (
  value: string | number | undefined | null,
): string => {
  if (value === undefined || value === null) {
    throw new Error("Invalid input: value cannot be undefined");
  }
  const base64 = Buffer.from(value.toString()).toString("base64");
  return safeUrlEncode(base64);
};

// Function to decode the value (returns the original type: string or number)
export const deobfuscate = (encodedValue: string): string | number => {
  const base64 = safeUrlDecode(encodedValue);
  const decodedString = Buffer.from(base64, "base64").toString("utf-8");

  // Check if the decoded value is a number
  const parsedNumber = parseFloat(decodedString);
  return isNaN(parsedNumber) ? decodedString : parsedNumber;
};

// Type-safe version of deobfuscate for numeric IDs
export const deobfuscateToNumber = (encodedValue: string): number => {
  const decodedValue = deobfuscate(encodedValue);
  if (typeof decodedValue !== "number") {
    throw new Error(
      "Decoded value is not a valid number. Can not decode value " +
        encodedValue,
    );
  }
  return decodedValue;
};

export const deobfuscateToString = (encodedValue: string): string => {
  const decodedValue = deobfuscate(encodedValue);
  if (typeof decodedValue !== "string") {
    throw new Error("Decoded value is not a valid string");
  }
  return decodedValue;
};
