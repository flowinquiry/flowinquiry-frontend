"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FormField, FormItem } from "@/components/ui/form";

interface WorkflowStatesSelectProps {
  fieldName: string;
  form: any;
  label: string;
  options: { label: string; value: string | number }[];
  placeholder?: string;
  required?: boolean;
}

const WorkflowStatesSelect = ({
  fieldName,
  form,
  label,
  options,
  placeholder = "Select a state",
  required = false,
}: WorkflowStatesSelectProps) => {
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => {
        const selectedOption = options.find(
          (option) => option.value === field.value,
        );

        return (
          <FormItem className="grid grid-cols-1">
            <label className="text-sm font-medium">{label}</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full text-left  justify-start"
                >
                  {selectedOption?.label || placeholder}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {options.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => field.onChange(option.value)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {form.formState.errors[fieldName]?.message && (
              <p className="text-sm text-red-500">
                {form.formState.errors[fieldName].message}
              </p>
            )}
          </FormItem>
        );
      }}
    />
  );
};

export default WorkflowStatesSelect;
