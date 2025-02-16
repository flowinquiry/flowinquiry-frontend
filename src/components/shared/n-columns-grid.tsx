import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Field = {
  label: string;
  value: React.ReactNode;
  colSpan?: number; // Number of columns to span (default: 1)
  tooltip?: string;
};

type NColumnsGridProps = {
  fields: Field[];
  columns?: number;
  gap?: string; // Gap between rows and columns (default: "4")
  className?: string; // Additional class names for the grid container
};

export const NColumnsGrid: React.FC<NColumnsGridProps> = ({
  fields,
  columns = 2,
  gap = "4",
  className = "",
}) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-${columns} gap-${gap} ${className}`}
    >
      {fields.map((field, index) => (
        <div
          key={index}
          className={`col-span-1 ${
            field.colSpan === 2 ? "sm:col-span-2" : ""
          } flex items-start gap-2`}
        >
          <span className="text-sm font-medium w-1/3 text-right">
            {field.label}
          </span>
          <div className="text-sm w-2/3 text-left">
            {field.tooltip ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-pointer">{field.value}</span>
                </TooltipTrigger>
                <TooltipContent>{field.tooltip}</TooltipContent>
              </Tooltip>
            ) : (
              field.value
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
