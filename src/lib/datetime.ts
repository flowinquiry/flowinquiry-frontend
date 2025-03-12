import { formatDistanceToNow } from "date-fns";

export const formatDateTimeDistanceToNow = (date?: Date | null) => {
  if (!date) {
    return "Invalid date";
  }

  return formatDistanceToNow(date, {
    addSuffix: true,
  });
};

export const formatDateTime = (date?: Date | null) => {
  if (!date) {
    return "Invalid date";
  }

  return `${date.toDateString()} ${date.toLocaleTimeString()}`;
};

/**
 * Converts a date range object into URL search parameters.
 * Ensures all dates are properly formatted in ISO 8601 format.
 */
export const formatDateParams = (dateParams: {
  range?: string;
  from?: Date;
  to?: Date;
}) => {
  const params = new URLSearchParams();

  if (dateParams.range) params.append("range", dateParams.range);
  if (dateParams.from) params.append("fromDate", dateParams.from.toISOString());
  if (dateParams.to) params.append("toDate", dateParams.to.toISOString());

  return params.toString();
};

export const calculateDuration = (
  startDate: string | Date,
  endDate: string | Date,
): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculate difference in days
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Format as weeks + days or just days
  if (diffDays >= 7) {
    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;
    return `${weeks} week${weeks !== 1 ? "s" : ""}${days > 0 ? `, ${days} day${days !== 1 ? "s" : ""}` : ""}`;
  } else {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
  }
};
