"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import React, { useEffect, useState } from "react";

import { UserAvatar } from "@/components/shared/avatar-display";
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
import { useDebounce } from "@/components/ui/multi-select-dynamic";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { findUsers } from "@/lib/actions/users.action";
import { cn } from "@/lib/utils";
import { useError } from "@/providers/error-provider";
import { QueryDTO } from "@/types/query";
import { UiAttributes } from "@/types/ui-components";

export const UserSelectField = ({
  form,
  fieldName,
  label,
  required = false,
}: ExtInputProps & UiAttributes) => {
  const [users, setUsers] = useState<
    { label: string; value: string; email: string; avatarUrl?: string }[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setError } = useError();
  const debouncedSearchTerm = useDebounce(searchTerm, 2000);

  useEffect(() => {
    if (!debouncedSearchTerm) {
      setUsers([]);
      return;
    }

    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const query: QueryDTO = {
          filters: debouncedSearchTerm
            ? [
                {
                  field: "firstName,lastName",
                  operator: "lk",
                  value: debouncedSearchTerm,
                },
              ]
            : [],
        };
        const data = await findUsers(
          query,
          {
            page: 1,
            size: 10,
            sort: [
              {
                field: "firstName,lastName",
                direction: "desc",
              },
            ],
          },
          setError,
        );
        const filterUsers = data.content.map((user) => ({
          label: `${user.firstName} ${user.lastName}`,
          value: String(user.id),
          email: user.email,
          avatarUrl: user.imageUrl ?? undefined,
        }));
        setUsers(filterUsers);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [debouncedSearchTerm]);

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className="flex flex-col py-2 w-[20rem]">
          <FormLabel>
            {label} {required && <span className="text-destructive"> *</span>}
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "justify-between",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  {field.value ? (
                    <div className="flex items-center gap-2">
                      <UserAvatar
                        imageUrl={
                          users.find(
                            (user) => Number(user.value) === field.value,
                          )?.avatarUrl ?? form.getValues("managerImageUrl") // Fallback to form data
                        }
                      />
                      <span>
                        {users.find(
                          (user) => Number(user.value) === field.value,
                        )?.label ?? form.getValues("managerName")}{" "}
                      </span>
                    </div>
                  ) : (
                    "Select a user"
                  )}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[24rem]">
              <Command>
                <CommandInput
                  placeholder="Typing some characters to search user..."
                  className="h-9"
                  onValueChange={(value) => setSearchTerm(value)}
                />
                <CommandList>
                  {isLoading && <CommandEmpty>Loading...</CommandEmpty>}
                  {!isLoading && users.length === 0 && (
                    <CommandEmpty>No users found.</CommandEmpty>
                  )}
                  <CommandGroup>
                    <CommandItem
                      value="none"
                      onSelect={() => {
                        form.setValue(fieldName, null); // Reset the field value to null
                      }}
                      className="gap-2 text-gray-500"
                    >
                      None (Unassign User)
                      <Check
                        className={cn(
                          "ml-auto",
                          field.value === null ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                    {users.map((user) => (
                      <Tooltip key={user.value}>
                        <TooltipTrigger asChild>
                          <div>
                            <CommandItem
                              className="cursor-pointer"
                              value={user.label}
                              onSelect={() => {
                                const numericValue = Number(user.value);
                                form.setValue(fieldName, numericValue);
                              }}
                            >
                              <UserAvatar imageUrl={user.avatarUrl} />
                              <span className="ml-2">{user.label}</span>
                              <Check
                                className={cn(
                                  "ml-auto",
                                  Number(user.value) === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <span>{user.email}</span>
                        </TooltipContent>
                      </Tooltip>
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

export default UserSelectField;
