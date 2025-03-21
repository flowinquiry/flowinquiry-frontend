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
// Import the existing schema
import { ProjectEpicDTOSchema } from "@/types/projects";

// Extend the schema only to handle form specifics (Date objects for UI)
// The core validation remains from the original schema
const formEpicSchema = ProjectEpicDTOSchema.extend({
  // Override datetime strings to use Date objects in the form
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

type EpicFormValues = z.infer<typeof formEpicSchema>;

interface CreateEpicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (epic: EpicFormValues) => void;
  onCancel: () => void;
  projectId: number;
}

export function CreateEpicDialog({
  open,
  onOpenChange,
  onSave,
  onCancel,
  projectId,
}: CreateEpicDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get default values with the current project ID
  const defaultValues: Partial<EpicFormValues> = {
    projectId,
    name: "",
    description: "",
    totalTickets: 0,
  };

  // Initialize form
  const form = useForm<EpicFormValues>({
    resolver: zodResolver(formEpicSchema),
    defaultValues,
  });

  // Reset form when dialog opens
  useState(() => {
    if (open) {
      form.reset(defaultValues);
    }
  });

  const handleSubmit = async (values: EpicFormValues) => {
    setIsSubmitting(true);
    try {
      // Pass the values directly to the parent component
      await onSave(values);
      // Reset the form
      form.reset(defaultValues);
    } catch (error) {
      console.error("Failed to save epic:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Epic</DialogTitle>
          <DialogDescription>
            Add a new epic to organize related features or large pieces of work.
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
                    <Input placeholder="User Authentication" {...field} />
                  </FormControl>
                  <FormDescription>
                    A short, descriptive name for this epic.
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
                    <FormLabel>Start Date (Optional)</FormLabel>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target End Date (Optional)</FormLabel>
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
                      placeholder="Describe the scope and goals of this epic"
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide details about what this epic encompasses.
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
                {isSubmitting ? "Creating..." : "Create Epic"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateEpicDialog;
