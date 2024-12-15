"use client";

import { formatDistanceToNow } from "date-fns";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  Ellipsis,
  Plus,
  RotateCw,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Heading } from "@/components/heading";
import { UserAvatar } from "@/components/shared/avatar-display";
import LoadingPlaceholder from "@/components/shared/loading-place-holder";
import PaginationExt from "@/components/shared/pagination-ext";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  deleteUser,
  resendActivationEmail,
  searchUsers,
} from "@/lib/actions/users.action";
import { obfuscate } from "@/lib/endecode";
import { cn } from "@/lib/utils";
import { QueryDTO } from "@/types/query";
import { PermissionUtils } from "@/types/resources";
import { UserDTO } from "@/types/users";

export const UserList = () => {
  const [items, setItems] = useState<Array<UserDTO>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);
  const [userSearchTerm, setUserSearchTerm] = useState<string | undefined>(
    undefined,
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const permissionLevel = usePagePermission();

  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const fetchUsers = useCallback(async () => {
    setLoading(true);

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

    searchUsers(query, {
      page: currentPage,
      size: 10,
      sort: [
        {
          field: "firstName,lastName",
          direction: sortDirection,
        },
      ],
    })
      .then((pageResult) => {
        setItems(pageResult.content);
        setTotalElements(pageResult.totalElements);
        setTotalPages(pageResult.totalPages);
      })
      .finally(() => setLoading(false));
  }, [
    userSearchTerm,
    currentPage,
    sortDirection,
    setLoading,
    setItems,
    setTotalElements,
    setTotalPages,
  ]);

  const handleSearchTeams = useDebouncedCallback((userName: string) => {
    const params = new URLSearchParams(searchParams);
    if (userName) {
      params.set("name", userName);
    } else {
      params.delete("name");
    }
    setUserSearchTerm(userName);
    replace(`${pathname}?${params.toString()}`);
  }, 2000);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  function onDeleteUser(user: UserDTO) {
    setSelectedUser(user);
    setIsDialogOpen(true);
  }

  async function confirmDeleteUser() {
    if (selectedUser) {
      await deleteUser(selectedUser.id!);
      setSelectedUser(null);
      await fetchUsers();
    }
    setIsDialogOpen(false);
    setSelectedUser(null);
  }

  function onResendActivationEmail(user: UserDTO) {
    resendActivationEmail(user.email).then(() => {
      toast.success(`An activation email has been sent to ${user.email}`);
    });
  }

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
            onChange={(e) => {
              handleSearchTeams(e.target.value);
            }}
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
        </div>
      </div>
      <Separator />
      {loading ? (
        <LoadingPlaceholder
          message="Loading user data..."
          skeletonCount={3}
          skeletonWidth="28rem"
        />
      ) : (
        <div className="flex flex-row flex-wrap gap-4 content-around">
          {items?.map((user) => (
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
                        onClick={() => onDeleteUser(user)}
                      >
                        <Trash />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              <div className="relative w-24 h-24">
                <UserAvatar imageUrl={user.imageUrl} size="w-24 h-24" />
                {user.status !== "ACTIVE" && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      Not Activated
                    </span>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="grid grid-cols-1">
                <div className="text-2xl">
                  <Button variant="link" className="px-0">
                    <Link href={`/portal/users/${obfuscate(user.id)}`}>
                      {user.firstName}, {user.lastName}
                    </Link>
                  </Button>
                </div>
                <div>
                  Email:{" "}
                  <Button variant="link" className="px-0 py-0 h-0">
                    <Link href={`mailto:${user.email}`}>{user.email}</Link>
                  </Button>
                </div>
                <div>Title: {user.title}</div>
                <div>Timezone: {user.timezone}</div>
                <div>
                  Last login time:{" "}
                  {user.lastLoginTime
                    ? formatDistanceToNow(new Date(user.lastLoginTime), {
                        addSuffix: true,
                      })
                    : "No recent login"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <PaginationExt
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete{" "}
            <strong>
              {selectedUser?.firstName} {selectedUser?.lastName}
            </strong>
            ? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
