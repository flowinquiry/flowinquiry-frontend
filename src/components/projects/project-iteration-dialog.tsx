import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

// Using the provided schema
const ProjectIterationDTOSchema = z.object({
  id: z.number().optional(),
  projectId: z.number(), // required
  name: z.string(), // required
  description: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  totalTickets: z.number().optional(),
});

// Extend the schema with some validation
const createIterationSchema = ProjectIterationDTOSchema.extend({
  // Override datetime to use Date objects in the form
  startDate: z.date().optional(),
  endDate: z.date().optional(),
}).refine(
  (data) => {
    // Skip validation if either date is missing
    if (!data.startDate || !data.endDate) return true;
    return data.endDate > data.startDate;
  },
  {
    message: "End date must be after start date",
    path: ["endDate"],
  },
);

type CreateIterationFormValues = z.infer<typeof createIterationSchema>;

interface CreateIterationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (iteration: CreateIterationFormValues) => void;
  onCancel: () => void;
  projectId: number;
}

export function CreateIterationDialog({
  open,
  onOpenChange,
  onSave,
  onCancel,
  projectId,
}: CreateIterationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get default values with the current project ID
  const defaultValues: Partial<CreateIterationFormValues> = {
    projectId,
    name: "",
    description: "",
    totalTickets: 0,
  };

  // Initialize form
  const form = useForm<CreateIterationFormValues>({
    resolver: zodResolver(createIterationSchema),
    defaultValues,
  });

  // Reset form when dialog opens
  useState(() => {
    if (open) {
      form.reset(defaultValues);
    }
  });

  const handleSubmit = async (values: CreateIterationFormValues) => {
    setIsSubmitting(true);
    try {
      // Create a copy of the values for submission
      // This ensures proper type conversion between the form and API
      const submissionValues = {
        ...values,
        // Keep the Date objects as they are for the onSave callback
        // The parent component will handle any necessary conversions
      };

      // Pass the values to the parent component to handle the save
      await onSave(submissionValues);
      // Reset the form
      form.reset(defaultValues);
    } catch (error) {
      console.error("Failed to save iteration:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Iteration</DialogTitle>
          <DialogDescription>
            Add a new iteration to organize your tasks into sprints or phases.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Sprint 1" {...field} />
                  </FormControl>
                  <FormDescription>
                    A short, descriptive name for this iteration.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full pl-3 text-left font-normal"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span className="text-muted-foreground">
                                Select a date
                              </span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      When this iteration begins.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full pl-3 text-left font-normal"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span className="text-muted-foreground">
                                Select a date
                              </span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      When this iteration is scheduled to end.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of this iteration's goals"
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: Provide additional context for this iteration.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Iteration"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateIterationDialog;
