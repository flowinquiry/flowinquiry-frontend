"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Heading } from "@/components/heading";
import TimezoneSelect from "@/components/shared/timezones-select";
import { Button } from "@/components/ui/button";
import { ExtInputField, SubmitButton } from "@/components/ui/ext-form";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import AuthoritiesSelect from "@/components/users/authorities-select";
import { createUser, findUserById } from "@/lib/actions/users.action";
import { UserDTO, UserDTOSchema } from "@/types/users";
import { obfuscate } from "@/lib/endecode";

type UserFormValues = z.infer<typeof UserDTOSchema>;

export const UserForm = ({ userId }: { userId?: number }) => {
  const router = useRouter();
  const [user, setUser] = useState<UserDTO | undefined>();
  const [loading, setLoading] = useState(!!userId); // Only show loading if userId is defined
  const [submitError, setSubmitError] = useState<string | null>(null); // State for error handling

  const form = useForm<UserFormValues>({
    resolver: zodResolver(UserDTOSchema),
    defaultValues: {},
  });

  const { reset } = form;

  useEffect(() => {
    async function fetchUser() {
      if (!userId) return; // Skip fetching if userId is undefined

      try {
        const userData = await findUserById(userId);
        if (userData) {
          setUser(userData);
          reset(userData);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId, reset]);

  async function onSubmit(data: UserDTO) {
    setSubmitError(null); // Reset error before submission
    try {
      const savedUser = await createUser(data);
      router.push(`/portal/users/${obfuscate(savedUser.id)}`);
    } catch (error: any) {
      setSubmitError(
        error?.message || "An error occurred while creating the user.",
      );
    }
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

          {submitError && (
            <div className="col-span-1 sm:col-span-2 text-red-600">
              {submitError}
            </div>
          )}

          <div className="md:col-span-2 flex flex-row gap-4">
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
