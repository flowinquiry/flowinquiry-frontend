"use client";

import React, { useEffect, useState } from "react";

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multi-select";
import { getAuthorities } from "@/lib/actions/authorities.action";
import { AuthorityDTO } from "@/types/authorities";
import { UiAttributes } from "@/types/ui-components";

interface AuthoritiesSelectProps {
  form: any;
  label: string;
}

const AuthoritiesSelect = ({
  form,
  label,
  required,
}: AuthoritiesSelectProps & UiAttributes) => {
  const [authorities, setAuthorities] = useState<AuthorityDTO[]>();

  useEffect(() => {
    const fetchAuthorities = async () => {
      const data = await getAuthorities(0);
      setAuthorities(data.content);
    };

    fetchAuthorities();
  }, []);

  if (authorities === undefined) {
    return <div>Can not load authorities</div>;
  }

  const options = authorities.map((auth) => ({
    value: auth.name,
    label: auth.descriptiveName,
  }));

  return (
    <FormField
      control={form.control}
      name="authorities"
      render={({ field }) => (
        <FormItem className="space-y-0">
          <FormLabel>
            {label}
            {required && <span className="text-destructive"> *</span>}
          </FormLabel>
          <MultiSelect
            options={options}
            onValueChange={field.onChange}
            defaultValue={field.value}
            placeholder="Select authorities"
            animation={2}
            maxCount={3}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AuthoritiesSelect;
