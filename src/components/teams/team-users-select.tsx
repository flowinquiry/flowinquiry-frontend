"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ExtInputProps } from "@/components/ui/ext-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { findMembersByTeamId } from "@/lib/actions/teams.action";
import { cn } from "@/lib/utils";
import { UiAttributes } from "@/types/ui-components";
import { UserWithTeamRoleDTO } from "@/types/users";

const TeamUserSelectField = ({
  form,
  fieldName,
  label,
  teamId,
}: ExtInputProps & UiAttributes & { teamId: number }) => {
  const [users, setUsers] = useState<UserWithTeamRoleDTO[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      const usersData = await findMembersByTeamId(teamId);
      setUsers(usersData);
    }
    fetchUsers();
  }, [teamId]);

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className="grid grid-cols-1">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-[200px] justify-between",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  {(() => {
                    const selectedUser = users.find(
                      (user) => user.id === field.value,
                    );
                    return selectedUser
                      ? `${selectedUser.firstName} ${selectedUser.lastName}`
                      : "Select user";
                  })()}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[18rem] p-0">
              <Command>
                <CommandInput placeholder="Search user..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No user found.</CommandEmpty>
                  <CommandGroup>
                    {users.map((user) => (
                      <CommandItem
                        value={user.firstName!}
                        key={user.id}
                        onSelect={() => {
                          form.setValue(fieldName, user.id);
                        }}
                      >
                        {user.firstName} {user.lastName} ({user.teamRole})
                        <Check
                          className={cn(
                            "ml-auto",
                            user.id === field.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TeamUserSelectField;
