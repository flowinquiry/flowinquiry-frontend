"use client";

import { formatDistanceToNow } from "date-fns";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

import { Heading } from "@/components/heading";
import PaginationExt from "@/components/shared/pagination-ext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import DefaultUserLogo from "@/components/users/user-logo";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { usePagePermission } from "@/hooks/use-page-permission";
import { searchUsers } from "@/lib/actions/users.action";
import { obfuscate } from "@/lib/endecode";
import { cn } from "@/lib/utils";
import { QueryDTO } from "@/types/query";
import { PermissionUtils } from "@/types/resources";
import { UserType } from "@/types/users";

export const UserList = () => {
  const [items, setItems] = useState<Array<UserType>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState<string | undefined>(
    undefined,
  );
  const permissionLevel = usePagePermission();

  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
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

      // Fetch data using the QueryDTO
      const pageResult = await searchUsers(query, {
        page: currentPage,
        size: 10,
      });
      setItems(pageResult.content);
      setTotalElements(pageResult.totalElements);
      setTotalPages(pageResult.totalPages);
    } finally {
      setLoading(false);
    }
  }, [
    userSearchTerm,
    currentPage,
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
    fetchData();
  }, [fetchData]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="py-4 grid grid-cols-1 gap-4">
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
      <div className="flex flex-row flex-wrap gap-4 content-around">
        {items?.map((user) => (
          <div
            key={user.id}
            className="w-[28rem] flex flex-row gap-4 border border-gray-200 px-4 py-4 rounded-2xl"
          >
            <div>
              <Avatar className="size-24 cursor-pointer ">
                <AvatarImage
                  src={
                    user?.imageUrl ? `/api/files/${user.imageUrl}` : undefined
                  }
                  alt={`${user.firstName} ${user.lastName}`}
                />
                <AvatarFallback>
                  <DefaultUserLogo />
                </AvatarFallback>
              </Avatar>
            </div>
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
      <PaginationExt
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};
