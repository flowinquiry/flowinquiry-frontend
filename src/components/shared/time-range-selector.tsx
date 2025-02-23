"use client";

import { DatePickerWithRange } from "@/components/shared/date-range-picker";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TimeRange, useTimeRange } from "@/providers/time-range-provider";

const TimeRangeSelector = () => {
  const { timeRange, setTimeRange, customDates } = useTimeRange();

  return (
    <div className="flex items-center gap-4">
      <ToggleGroup
        type="single"
        value={timeRange}
        onValueChange={(value) => setTimeRange(value as TimeRange)}
      >
        <ToggleGroupItem value="7d">Last 7 Days</ToggleGroupItem>
        <ToggleGroupItem value="30d">Last 30 Days</ToggleGroupItem>
        <ToggleGroupItem value="90d">Last 90 Days</ToggleGroupItem>
        <ToggleGroupItem value="custom">Custom Range</ToggleGroupItem>
      </ToggleGroup>

      {timeRange === "custom" && (
        <DatePickerWithRange
          value={customDates}
          onChangeAction={(dates) => setTimeRange("custom", dates)}
        />
      )}
    </div>
  );
};

export default TimeRangeSelector;
