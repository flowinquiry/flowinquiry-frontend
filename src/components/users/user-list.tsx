"use client";

import {
  ArrowDownAZ,
  ArrowUpAZ,
  Ellipsis,
  Network,
  Plus,
  RotateCw,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import useSWR from "swr";

import { Heading } from "@/components/heading";
import { UserAvatar } from "@/components/shared/avatar-display";
import LoadingPlaceholder from "@/components/shared/loading-place-holder";
import PaginationExt from "@/components/shared/pagination-ext";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { usePagePermission } from "@/hooks/use-page-permission";
import { useToast } from "@/hooks/use-toast";
import {
  deleteUser,
  findUsers,
  resendActivationEmail,
} from "@/lib/actions/users.action";
import { obfuscate } from "@/lib/endecode";
import { cn } from "@/lib/utils";
import { useError } from "@/providers/error-provider";
import { QueryDTO } from "@/types/query";
import { PermissionUtils } from "@/types/resources";
import { UserDTO } from "@/types/users";

export const UserList = () => {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);
  const [userSearchTerm, setUserSearchTerm] = useState<string | undefined>(
    undefined,
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isOrgChartOpen, setIsOrgChartOpen] = useState(false);

  const permissionLevel = usePagePermission();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const { setError } = useError();

  // **SWR Fetcher Function**
  const fetchUsers = async () => {
    const query: QueryDTO = {
      filters: userSearchTerm
        ? [
            {
              field: "firstName,lastName",
              operator: "lk",
              value: userSearchTerm,
            },
          ]
        : [],
    };

    return findUsers(
      query,
      {
        page: currentPage,
        size: 10,
        sort: [{ field: "firstName,lastName", direction: sortDirection }],
      },
      setError,
    );
  };

  // **Use SWR for Fetching Users**
  const { data, error, isLoading, mutate } = useSWR(
    [`/api/users`, userSearchTerm, currentPage, sortDirection],
    fetchUsers,
  );

  const users = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 0;

  // **Handle Search with Debouncing**
  const handleSearchUsers = useDebouncedCallback((userName: string) => {
    const params = new URLSearchParams(searchParams);
    if (userName) {
      params.set("name", userName);
    } else {
      params.delete("name");
    }
    setUserSearchTerm(userName);
    replace(`${pathname}?${params.toString()}`);
  }, 2000);

  // **Toggle Sorting**
  const toggleSortDirection = () =>
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));

  // **Delete User and Refresh Data**
  const confirmDeleteUser = async () => {
    if (selectedUser) {
      await deleteUser(selectedUser.id!, setError);
      setSelectedUser(null);
      mutate(); // Refresh user list
    }
    setIsDialogOpen(false);
  };

  // **Resend Activation Email**
  const onResendActivationEmail = (user: UserDTO) => {
    resendActivationEmail(user.email, setError).then(() => {
      toast({
        description: `An activation email has been sent to ${user.email}`,
      });
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex flex-row justify-between">
        <Heading
          title={`Users (${totalElements})`}
          description="Manage users"
        />

        <div className="flex space-x-4">
          <Input
            className="w-[18rem]"
            placeholder="Search user names ..."
            onChange={(e) => handleSearchUsers(e.target.value)}
            defaultValue={searchParams.get("name")?.toString()}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" onClick={toggleSortDirection}>
                {sortDirection === "asc" ? <ArrowDownAZ /> : <ArrowUpAZ />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {sortDirection === "asc"
                ? "Sort names A → Z"
                : "Sort names Z → A"}
            </TooltipContent>
          </Tooltip>
          {PermissionUtils.canWrite(permissionLevel) && (
            <Link
              href={"/portal/users/new/edit"}
              className={cn(buttonVariants({ variant: "default" }))}
            >
              <Plus className="mr-2 h-4 w-4" /> Invite user
            </Link>
          )}
          <Button onClick={() => setIsOrgChartOpen(true)}>
            <Network />
            Org chart
          </Button>
        </div>
      </div>
      <Separator />
      {isLoading ? (
        <LoadingPlaceholder
          message="Loading user data..."
          skeletonCount={3}
          skeletonWidth="28rem"
        />
      ) : (
        <div className="flex flex-row flex-wrap gap-4 content-around">
          {users.map((user) => (
            <div
              key={user.id}
              className="relative w-[28rem] flex flex-row gap-4 border px-4 py-4 rounded-2xl border-gray-200 bg-white dark:bg-gray-800"
            >
              {PermissionUtils.canAccess(permissionLevel) && (
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Ellipsis className="cursor-pointer text-gray-400" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      {user.status == "PENDING" && (
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => onResendActivationEmail(user)}
                        >
                          <RotateCw />
                          Resend Activation Email
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Trash />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              <UserAvatar imageUrl={user.imageUrl} size="w-24 h-24" />
              <div>
                <Button variant="link" asChild className="px-0">
                  <Link href={`/portal/users/${obfuscate(user.id)}`}>
                    {user.firstName}, {user.lastName}
                  </Link>
                </Button>
                <div>Email: {user.email}</div>
                <div>Title: {user.title}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <PaginationExt
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
