export const obfuscate = (value: string | number | null | undefined) => {
  if (value === undefined || value === null) {
    throw new Error("Invalid input: value cannot be null or undefined");
  }
  const base64 = Buffer.from(value.toString(), "utf-8").toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

export const deobfuscate = (encodedValue: string | null | undefined) => {
  if (!encodedValue) {
    throw new Error("Invalid input: encodedValue cannot be null or empty");
  }
  let base64 = encodedValue.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  const decodedString = Buffer.from(base64, "base64").toString("utf-8");

  // Try to parse as number, else return string
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
