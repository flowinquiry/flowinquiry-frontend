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
