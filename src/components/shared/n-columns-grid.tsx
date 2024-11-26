type Field = {
  label: string; // Label for the field
  value: React.ReactNode; // Value of the field, can be any JSX
  colSpan?: number; // Number of columns to span (default: 1)
};

type NColumnsGridProps = {
  fields: Field[]; // Array of fields to render
  columns?: number; // Total number of columns in the grid (default: 2)
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
          {/* Label */}
          <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400 w-1/3 text-right">
            {field.label}
          </span>
          {/* Value */}
          <div className="text-sm w-2/3 text-left">{field.value}</div>
        </div>
      ))}
    </div>
  );
};
