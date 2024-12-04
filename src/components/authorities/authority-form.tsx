"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/ext-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  batchSavePermissions,
  createAuthority,
  findPermissionsByAuthorityName,
} from "@/lib/actions/authorities.action";
import { obfuscate } from "@/lib/endecode";
import {
  AuthorityDTO,
  AuthorityDTOSchema,
  AuthorityResourcePermissionDTO,
  AuthorityResourcePermissionDTOSchema,
} from "@/types/authorities";

type NewAuthorityFormProps = {
  authorityEntity?: AuthorityDTO | undefined;
};

const formSchema = z.object({
  authority: AuthorityDTOSchema,
  permissions: z.array(AuthorityResourcePermissionDTOSchema),
});

type FormData = z.infer<typeof formSchema>;

const permissionOptions = ["NONE", "READ", "WRITE", "ACCESS"];

const AuthorityForm: React.FC<NewAuthorityFormProps> = ({
  authorityEntity,
}) => {
  const router = useRouter();
  const [authorityResourcePermissions, setAuthorityResourcePermissions] =
    useState<Array<AuthorityResourcePermissionDTO>>();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      authority: authorityEntity,
      permissions: [],
    },
  });

  const { reset } = form;

  useEffect(() => {
    async function fetchAuthorityResourcePermissions() {
      if (authorityEntity) {
        const data = await findPermissionsByAuthorityName(authorityEntity.name);
        setAuthorityResourcePermissions(data);
        reset({
          authority: authorityEntity,
          permissions: data.map((perm) => ({
            ...perm,
            permission: perm.permission || "NONE", // Default permission to "NONE" if not defined
          })),
        });
      }
    }
    fetchAuthorityResourcePermissions();
  }, []);

  async function onSubmit(formData: FormData) {
    await createAuthority(formData.authority);
    await batchSavePermissions(formData.permissions);
    router.push(
      `/portal/settings/authorities/${obfuscate(formData.authority.name)}`,
    );
  }

  const isSystemRole = authorityEntity?.systemRole;

  return (
    <div className="flex flex-col">
      <Form {...form}>
        <div>
          <form
            className="grid grid-cols-1 gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* Authority Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Authority Details</h2>
              <FormField
                control={form.control}
                name="authority.descriptiveName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Authority Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter authority name"
                        {...field}
                        disabled={isSystemRole}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="authority.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {authorityResourcePermissions &&
              authorityResourcePermissions.length > 0 && (
                <div className="space-y-4 mt-6">
                  <h2 className="text-xl font-bold">Resource Permissions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {authorityResourcePermissions.map((perm, index) => {
                      return (
                        <FormField
                          key={perm.resourceName}
                          control={form.control}
                          name={`permissions.${index}.permission`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{perm.resourceName}</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value || "NONE"}
                                  disabled={isSystemRole}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select permission" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {permissionOptions.map((option) => (
                                      <SelectItem key={option} value={option}>
                                        {option}
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
                    })}
                  </div>
                </div>
              )}
            <div className="flex items-center gap-4 pt-4">
              <SubmitButton
                label="Save changes"
                labelWhileLoading="Save changes ..."
              />
              <Button variant="secondary" onClick={() => router.back()}>
                Discard
              </Button>
            </div>
          </form>
        </div>
      </Form>
    </div>
  );
};

export default AuthorityForm;
