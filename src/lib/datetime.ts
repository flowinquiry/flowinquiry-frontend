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
