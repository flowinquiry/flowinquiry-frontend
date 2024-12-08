export interface UiAttributes {
  required?: boolean;
}

export type FilterOption = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
};
