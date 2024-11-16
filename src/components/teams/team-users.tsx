"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import PaginationExt from "@/components/shared/pagination-ext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ViewProps } from "@/components/ui/ext-form";
import DefaultUserLogo from "@/components/users/user-logo";
import { usePagePermission } from "@/hooks/use-page-permission";
import { findMembersByTeamId } from "@/lib/actions/teams.action";
import { obfuscate } from "@/lib/endecode";
import { PermissionUtils } from "@/types/resources";
import { TeamType } from "@/types/teams";
import { UserType } from "@/types/users";

const TeamUsersView = ({ entity: team }: ViewProps<TeamType>) => {
  const permissionLevel = usePagePermission();
  const [items, setItems] = useState<Array<UserType>>([]); // Store the items
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(0); // Total pages
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false); // Loading state
  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const pageResult = await findMembersByTeamId(team.id!);

      setItems(pageResult.content); // Update items
      setTotalElements(pageResult.totalElements);
      setTotalPages(pageResult.totalPages); // Update total pages
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts or page changes
  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex flex-row justify-between gap-4 items-center justify-center">
        <div className="text-2xl w-full">{team.name}</div>
        {PermissionUtils.canWrite(permissionLevel) && (
          <Button onClick={() => console.log("Add user")}>
            <Plus /> Add User
          </Button>
        )}
      </div>
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
            <div>
              <div className="text-xl">
                <Button variant="link" asChild className="px-0">
                  <Link href={`/portal/users/${obfuscate(user.id)}`}>
                    {user.firstName}, {user.lastName}
                  </Link>
                </Button>
              </div>
              <div>
                <b>Email:</b>{" "}
                <Link href={`mailto:${user.email}`}>{user.email}</Link>
              </div>
              <div>Timezone: {user.timezone}</div>
              <div>Title: {user.title}</div>
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

export default TeamUsersView;
