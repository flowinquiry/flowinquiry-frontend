"use client";

import { format } from "date-fns";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithRangeProps {
  value?: DateRange;
  onChangeAction: (dates: DateRange) => void;
}

export const DatePickerWithRange = ({
  value,
  onChangeAction,
}: DatePickerWithRangeProps) => {
  const [dates, setDates] = useState<DateRange>(
    value || { from: new Date(), to: new Date() },
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {dates.from ? format(dates.from, "MMM dd, yyyy") : "Start Date"} -{" "}
          {dates.to ? format(dates.to, "MMM dd, yyyy") : "End Date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          mode="range"
          selected={dates}
          onSelect={(range) => {
            if (range?.from && range?.to) {
              setDates(range);
              onChangeAction?.(range); // Call the renamed prop
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
