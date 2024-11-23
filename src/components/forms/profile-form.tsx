"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Heading } from "@/components/heading";
import { ImageCropper } from "@/components/image-cropper";
import { CountrySelectField } from "@/components/shared/countries-select";
import TimezoneSelect from "@/components/shared/timezones-select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExtInputField, ExtTextAreaField } from "@/components/ui/ext-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import DefaultUserLogo from "@/components/users/user-logo";
import { useImageCropper } from "@/hooks/use-image-cropper";
import { findUserById } from "@/lib/actions/users.action";
import { apiClient } from "@/lib/api-client";
import { obfuscate } from "@/lib/endecode";
import { userSchema } from "@/types/users";

const userSchemaWithFile = userSchema.extend({
  file: z.any().optional(), // Add file as an optional field of any type
});

type UserTypeWithFile = z.infer<typeof userSchemaWithFile>;

export const ProfileForm = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const {
    selectedFile,
    setSelectedFile,
    isDialogOpen,
    setDialogOpen,
    getRootProps,
    getInputProps,
  } = useImageCropper();

  const [user, setUser] = useState<UserTypeWithFile | undefined>(undefined);

  const handleSubmit = async (data: UserTypeWithFile) => {
    const formData = new FormData();

    const userJsonBlob = new Blob([JSON.stringify(data)], {
      type: "application/json",
    });
    formData.append("userDTO", userJsonBlob);

    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    await apiClient(
      "/api/admin/users",
      "PUT",
      formData,
      session?.user?.accessToken,
    );
    router.push(`/portal/users/${obfuscate(user?.id)}`);
  };

  useEffect(() => {
    async function loadUserInfo() {
      const userData = await findUserById(Number(session?.user?.id));
      setUser({ ...userData, file: undefined });

      if (userData) {
        form.reset(userData);
      }
    }
    loadUserInfo();
  }, []);

  const form = useForm<UserTypeWithFile>({
    resolver: zodResolver(userSchemaWithFile),
  });

  return (
    <div className="grid grid-cols-1 gap-4">
      <Heading
        title="Profile"
        description="Manage your account details here. Update your email, profile picture, password, and other personal information to keep your profile accurate and secure"
      />
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-row gap-4"
        >
          <div>
            {selectedFile ? (
              <ImageCropper
                dialogOpen={isDialogOpen}
                setDialogOpen={setDialogOpen}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
              />
            ) : (
              <Avatar
                {...getRootProps()}
                className="size-36 cursor-pointer ring-offset-2 ring-2 ring-slate-200"
              >
                <input {...getInputProps()} />
                <AvatarImage src={undefined} alt="@flexwork" />
                <AvatarFallback>
                  <DefaultUserLogo />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <TimezoneSelect
              form={form}
              required={true}
              fieldName="timezone"
              label="Timezone"
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
            <ExtTextAreaField form={form} fieldName="about" label="About" />
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
            <CountrySelectField
              form={form}
              fieldName="country"
              label="Country"
            />
            <div className="md:col-span-2 flex flex-row gap-4">
              <Button type="submit">Submit</Button>
              <Button variant="secondary" onClick={() => router.back()}>
                Discard
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
