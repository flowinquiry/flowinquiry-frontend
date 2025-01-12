import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = {},
) {
  return new Intl.DateTimeFormat("en-US", {
    month: opts.month ?? "long",
    day: opts.day ?? "numeric",
    year: opts.year ?? "numeric",
    ...opts,
  }).format(new Date(date));
}

export function toSentenceCase(str: string) {
  return str
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase())
    .replace(/\s+/g, " ")
    .trim();
}

export function getUrlFromString(str: string) {
  if (isValidUrl(str)) {
    return str;
  }
  try {
    if (str.includes(".") && !str.includes(" ")) {
      return new URL(`https://${str}`).toString();
    }
  } catch {
    return null;
  }
}

export function isValidUrl(url: string) {
  return /^https?:\/\/\S+$/.test(url);
}

export const getSpecifiedColor = (name: string): Record<string, string> => {
  const hash = Array.from(name).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0,
  );

  // Define an array of color options
  const colors = [
    { background: "#E3F2FD", text: "#0A3E8C" }, // Light Blue
    { background: "#C8E6C9", text: "#1C5E2B" }, // Light Green
    { background: "#FFE082", text: "#664700" }, // Amber
    { background: "#FFCDD2", text: "#8C1A1C" }, // Light Red
    { background: "#D1C4E9", text: "#3E1D72" }, // Light Purple
    { background: "#F0F4C3", text: "#5A5E16" }, // Lime Green
    { background: "#80DEEA", text: "#00494A" }, // Teal
    { background: "#F48FB1", text: "#801437" }, // Pink
    { background: "#AED581", text: "#335213" }, // Light Olive
    { background: "#FFCC80", text: "#5D3200" }, // Light Orange
  ];

  // Pick a color based on the hash
  const index = hash % colors.length;
  return {
    background: colors[index].background,
    text: colors[index].text,
  };
};

export const randomPair = () => {
  const randomValue = Math.random().toString(36).substring(2, 15);
  return `random=${randomValue}`;
};

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {},
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate"
      ? (accurateSizes[i] ?? "Bytes")
      : (sizes[i] ?? "Bytes")
  }`;
}
