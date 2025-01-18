"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Heading } from "@/components/heading";
import { ImageCropper } from "@/components/image-cropper";
import { UserAvatar } from "@/components/shared/avatar-display";
import { CountrySelectField } from "@/components/shared/countries-select";
import TimezoneSelect from "@/components/shared/timezones-select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useImageCropper } from "@/hooks/use-image-cropper";
import { useToast } from "@/hooks/use-toast";
import {
  changePassword,
  findUserById,
  updateUser,
} from "@/lib/actions/users.action";
import { useError } from "@/providers/error-provider";
import { UserDTOSchema } from "@/types/users";

const userSchemaWithFile = UserDTOSchema.extend({
  file: z.any().optional(),
});

const passwordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Current Password must be at least 1 characters"),
  newPassword: z.string().min(8, "New Password must be at least 6 characters"),
});

type UserTypeWithFile = z.infer<typeof userSchemaWithFile>;

export const ProfileForm = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const {
    selectedFile,
    setSelectedFile,
    isDialogOpen,
    setDialogOpen,
    getRootProps,
    getInputProps,
  } = useImageCropper();

  const [user, setUser] = useState<UserTypeWithFile | undefined>(undefined);
  const { setError } = useError();
  const [isConfirmationOpen, setConfirmationOpen] = useState(false);
  const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
  });

  const onSubmit = async (data: UserTypeWithFile) => {
    const formData = new FormData();

    const userJsonBlob = new Blob([JSON.stringify(data)], {
      type: "application/json",
    });
    formData.append("userDTO", userJsonBlob);

    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    await updateUser(formData, setError);
    toast({ description: "Save profile successfully" });
  };

  const handleChangePassword = async (data: z.infer<typeof passwordSchema>) => {
    try {
      await changePassword(data.currentPassword, data.newPassword, setError);
      setPasswordDialogOpen(false);
      setConfirmationOpen(true);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Can not change the password",
      });
    }
  };

  useEffect(() => {
    async function loadUserInfo() {
      const userData = await findUserById(Number(session?.user?.id), setError);
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

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
  });

  return (
    <div className="grid grid-cols-1 gap-4">
      <Heading
        title="Profile"
        description="Manage your account details here. Update your email, profile picture, password, and other personal information to keep your profile accurate and secure."
      />
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-row gap-4"
        >
          <div className="flex flex-col items-center space-y-2">
            {selectedFile ? (
              <ImageCropper
                dialogOpen={isDialogOpen}
                setDialogOpen={setDialogOpen}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
              />
            ) : (
              <>
                <input {...getInputProps()} />
                <UserAvatar
                  {...getRootProps()}
                  size="w-36 h-36"
                  className="cursor-pointer ring-offset-2 ring-2 ring-slate-200"
                  imageUrl={session?.user?.imageUrl}
                />
              </>
            )}
            <Dialog
              open={isPasswordDialogOpen}
              onOpenChange={setPasswordDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="link" className="mt-2">
                  Change Password
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>
                <Form {...passwordForm}>
                  <form
                    onSubmit={passwordForm.handleSubmit(handleChangePassword)}
                    className="grid grid-cols-1 gap-4"
                  >
                    {/* Current Password Field */}
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={
                                  showPasswords.currentPassword
                                    ? "text"
                                    : "password"
                                }
                                placeholder="Enter current password"
                              />
                              <button
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                                onClick={() =>
                                  setShowPasswords((prev) => ({
                                    ...prev,
                                    currentPassword: !prev.currentPassword,
                                  }))
                                }
                              >
                                {showPasswords.currentPassword ? (
                                  <EyeOff size={20} />
                                ) : (
                                  <Eye size={20} />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* New Password Field */}
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={
                                  showPasswords.newPassword
                                    ? "text"
                                    : "password"
                                }
                                placeholder="Enter new password"
                              />
                              <button
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                                onClick={() =>
                                  setShowPasswords((prev) => ({
                                    ...prev,
                                    newPassword: !prev.newPassword,
                                  }))
                                }
                              >
                                {showPasswords.newPassword ? (
                                  <EyeOff size={20} />
                                ) : (
                                  <Eye size={20} />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Submit and Cancel Buttons */}
                    <div className="flex flex-row gap-4">
                      <Button type="submit">Save</Button>
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => setPasswordDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
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

      <Dialog open={isConfirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Password Updated</DialogTitle>
          </DialogHeader>
          <p>Your password has been updated successfully!</p>
          <div className="mt-4">
            <Button onClick={() => setConfirmationOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
