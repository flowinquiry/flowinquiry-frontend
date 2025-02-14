"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Heading } from "@/components/heading";
import { CountrySelectField } from "@/components/shared/countries-select";
import TimezoneSelect from "@/components/shared/timezones-select";
import UserSelectField from "@/components/shared/user-select";
import { Button } from "@/components/ui/button";
import {
  ExtInputField,
  ExtTextAreaField,
  SubmitButton,
} from "@/components/ui/ext-form";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import AuthoritiesSelect from "@/components/users/authorities-select";
import {
  createUser,
  findUserById,
  updateUser,
} from "@/lib/actions/users.action";
import { obfuscate } from "@/lib/endecode";
import { useError } from "@/providers/error-provider";
import { UserDTO, UserDTOSchema } from "@/types/users";

type UserFormValues = z.infer<typeof UserDTOSchema>;

export const UserForm = ({ userId }: { userId?: number }) => {
  const router = useRouter();
  const [user, setUser] = useState<UserDTO | undefined>();
  const [loading, setLoading] = useState(!!userId); // Only show loading if userId is defined
  const { setError } = useError();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(UserDTOSchema),
    defaultValues: {},
  });

  const { reset } = form;

  useEffect(() => {
    async function fetchUser() {
      if (!userId) return;

      try {
        const userData = await findUserById(userId, setError);
        if (userData) {
          setUser(userData);
          reset(userData);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId, reset]);

  async function onSubmit(data: UserDTO) {
    const savedUser = data.id
      ? await updateUser(prepareFormData(data), setError)
      : await createUser(data, setError);
    router.push(`/portal/users/${obfuscate(savedUser.id)}`);
  }

  function prepareFormData(data: UserDTO): FormData {
    const formData = new FormData();
    const userJsonBlob = new Blob([JSON.stringify(data)], {
      type: "application/json",
    });
    formData.append("userDTO", userJsonBlob);
    return formData;
  }

  const isEdit = !!user;
  const title = isEdit
    ? `Edit User ${user?.firstName} ${user?.lastName}`
    : "Create User";
  const description = isEdit ? `Edit user` : "Add a new user";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-[72rem]"
        >
          {/* Email field spans the entire row */}
          <div className="sm:col-span-2">
            <ExtInputField
              form={form}
              required={true}
              fieldName="email"
              label="Email"
              placeholder="Email"
              className="w-[20rem]"
            />
          </div>

          <UserSelectField form={form} fieldName="managerId" label="Manager" />
          <AuthoritiesSelect
            form={form}
            label="Authority"
            fieldName="authorities"
            required={true}
          />
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
          <ExtTextAreaField
            form={form}
            fieldName="about"
            label="About"
            placeholder="About"
          />
          <ExtInputField
            form={form}
            fieldName="title"
            label="Title"
            placeholder="Title"
          />
          <TimezoneSelect
            form={form}
            fieldName="timezone"
            label="Timezone"
            placeholder="Timezone"
            required={true}
          />
          <ExtInputField
            form={form}
            fieldName="address"
            label="Address"
            placeholder="Address"
          />
          <ExtInputField
            form={form}
            fieldName="city"
            label="City"
            placeholder="City"
          />
          <ExtInputField
            form={form}
            fieldName="state"
            label="State"
            placeholder="State"
          />
          <CountrySelectField form={form} fieldName="country" label="Country" />

          {/* Buttons section spans the entire row */}
          <div className="sm:col-span-2 flex flex-row gap-4">
            <SubmitButton
              label={isEdit ? "Update" : "Invite"}
              labelWhileLoading={isEdit ? "Updating..." : "Inviting..."}
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
