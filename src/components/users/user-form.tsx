"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Heading } from "@/components/heading";
import TimezoneSelect from "@/components/shared/timezones-select";
import { Button } from "@/components/ui/button";
import { ExtInputField, SubmitButton } from "@/components/ui/ext-form";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import AuthoritiesSelect from "@/components/users/authorities-select";
import { createUser } from "@/lib/actions/users.action";
import { userSchema, UserType } from "@/types/users";

interface UserFormProps {
  initialData: any | null;
}

type UserFormValues = z.infer<typeof userSchema>;

export const UserForm: React.FC<UserFormProps> = ({ initialData }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isEdit = !!initialData;
  const title = isEdit ? "Edit User" : "Create User";
  const description = isEdit ? "Edit user" : "Add a new user";

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData,
  });

  async function onSubmit(data: UserType) {
    await createUser(data);
    router.push("/portal/users");
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-[72rem]"
        >
          <ExtInputField
            form={form}
            required={true}
            fieldName="email"
            label="Email"
            placeholder="Email"
          />
          <AuthoritiesSelect form={form} required={true} label="Authority" />
          <ExtInputField
            form={form}
            required={true}
            fieldName="firstName"
            label="First Name"
            placeholder="First Name"
          />
          <ExtInputField
            form={form}
            required={true}
            fieldName="lastName"
            label="Last Name"
            placeholder="Last Name"
          />
          <TimezoneSelect
            form={form}
            fieldName="timezone"
            label="Timezone"
            placeholder="Timezone"
            required={true}
          />
          <div className="md:col-span-2 flex flex-row gap-4">
            <SubmitButton
              label="Invite user"
              labelWhileLoading="Creating ..."
            />
            <Button variant="secondary" onClick={() => router.back()}>
              Discard
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
