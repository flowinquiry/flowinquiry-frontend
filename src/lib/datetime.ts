import { formatDistanceToNow } from "date-fns";

export const formatDateTimeDistanceToNow = (date: Date) => {
  return formatDistanceToNow(date, {
    addSuffix: true,
  });
};

export const formatDateTime = (date: Date) => {
  return `${date.toDateString()} ${date.toLocaleTimeString()}`;
};
