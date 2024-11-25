"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

import AccountIndustriesSelect from "@/components/accounts/account-industries-select";
import AccountStatusSelect from "@/components/accounts/account-status-select";
import AccountTypesSelect from "@/components/accounts/account-types-select";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import {
  ExtInputField,
  ExtTextAreaField,
  FormProps,
  SubmitButton,
} from "@/components/ui/ext-form";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { saveOrUpdateAccount } from "@/lib/actions/accounts.action";
import { validateForm } from "@/lib/validator";
import { AccountDTO, AccountDTOSchema } from "@/types/accounts";

export const AccountForm = ({ initialData }: FormProps<AccountDTO>) => {
  const router = useRouter();

  const form = useForm<AccountDTO>({
    resolver: zodResolver(AccountDTOSchema),
    defaultValues: initialData,
  });

  async function onSubmit(account: AccountDTO) {
    if (validateForm(account, AccountDTOSchema, form)) {
      await saveOrUpdateAccount(isEdit, account);
    }
  }

  const isEdit = !!initialData;
  const title = isEdit ? `Edit account ${initialData?.name}` : "Create account";
  const description = isEdit ? "Edit account" : "Add a new account";
  const submitText = isEdit ? "Save changes" : "Create";
  const submitTextWhileLoading = isEdit ? "Saving changes ..." : "Creating ...";

  return (
    <div className="py-4 grid grid-cols-1 gap-4">
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
      <Form {...form}>
        <form
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-[72rem]"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <ExtInputField
            form={form}
            required={true}
            fieldName="name"
            label="Name"
            placeholder="Account Name"
          />
          <AccountTypesSelect form={form} required={true} />
          <AccountIndustriesSelect form={form} required={true} />
          <ExtInputField
            form={form}
            fieldName="addressLine1"
            label="Address 1"
            placeholder="Address 1"
          />
          <ExtInputField
            form={form}
            fieldName="addressLine2"
            label="Address 2"
            placeholder="Address 2"
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
          <ExtInputField
            form={form}
            fieldName="postalCode"
            label="Postal Code"
            placeholder="Postal Code"
          />
          <ExtInputField
            form={form}
            fieldName="phoneNumber"
            label="Phone"
            placeholder="Phone number"
          />
          <ExtInputField
            form={form}
            fieldName="website"
            label="Website"
            placeholder="https://example.com"
          />
          <ExtInputField
            form={form}
            fieldName="annualRevenue"
            label="Annual Revenue"
            placeholder="Annual Revenue"
          />
          <AccountStatusSelect form={form} required={true} />
          <ExtTextAreaField form={form} fieldName="notes" label="Notes" />
          <div className="md:col-span-2 flex flex-row gap-4">
            <SubmitButton
              label={submitText}
              labelWhileLoading={submitTextWhileLoading}
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

export default AccountForm;
