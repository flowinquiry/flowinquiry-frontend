"use client";

import React, { useEffect } from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TicketChannel } from "@/types/team-requests";

type TicketChannelSelectFieldProps = {
  form: any;
};

const ticketChannels: TicketChannel[] = [
  "Email",
  "Phone",
  "Web Portal",
  "Chat",
  "Social Media",
  "In-person",
  "Mobile App",
  "API",
  "System-generated",
  "Internal",
];

const TicketChannelSelectField: React.FC<TicketChannelSelectFieldProps> = ({
  form,
}) => {
  useEffect(() => {
    // Set default value if the field is empty
    if (!form.getValues("channel")) {
      form.setValue("channel", "Internal", { shouldValidate: true });
    }
  }, [form]);

  return (
    <FormField
      control={form.control}
      name="channel"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Ticket Channel</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              value={field.value || "Internal"} // Use "Internal" as fallback
            >
              <SelectTrigger className="w-[16rem]">
                <SelectValue placeholder="Select a channel" />
              </SelectTrigger>
              <SelectContent className="w-[16rem]">
                {ticketChannels.map((channel) => (
                  <SelectItem key={channel} value={channel}>
                    {channel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TicketChannelSelectField;
