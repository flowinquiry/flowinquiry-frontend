"use client";

import { Ellipsis, Plus, Trash } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import PaginationExt from "@/components/shared/pagination-ext";
import AddUserToTeamDialog from "@/components/teams/team-add-user-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ViewProps } from "@/components/ui/ext-form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DefaultUserLogo from "@/components/users/user-logo";
import { usePagePermission } from "@/hooks/use-page-permission";
import {
  deleteUserFromTeam,
  findMembersByTeamId,
} from "@/lib/actions/teams.action";
import { obfuscate } from "@/lib/endecode";
import { PermissionUtils } from "@/types/resources";
import { TeamType } from "@/types/teams";
import { UserType } from "@/types/users";

const TeamUsersView = ({ entity: team }: ViewProps<TeamType>) => {
  const permissionLevel = usePagePermission();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Array<UserType>>([]); // Store the items
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(0); // Total pages
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false); // Loading state

  const fetchUsers = async (page: number) => {
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

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  async function removeUserOutTeam(user: UserType) {
    await deleteUserFromTeam(team.id!, user.id!);
    await fetchUsers(0);
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex flex-row justify-between gap-4 items-center justify-center">
        <div className="text-2xl w-full">{team.name}</div>
        {PermissionUtils.canWrite(permissionLevel) && (
          <div>
            <Button onClick={() => setOpen(true)}>
              <Plus /> Add User
            </Button>
            <AddUserToTeamDialog
              open={open}
              setOpen={setOpen}
              teamEntity={team}
              onSaveSuccess={() => fetchUsers(0)}
            />
          </div>
        )}
      </div>
      <div className="flex flex-row flex-wrap gap-4 content-around">
        {items?.map((user) => (
          <div
            key={user.id}
            className="w-[28rem] flex flex-row gap-4 border border-gray-200 px-4 py-4 rounded-2xl relative"
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
            {PermissionUtils.canWrite(permissionLevel) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Ellipsis className="cursor-pointer absolute top-2 right-2 text-gray-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[14rem] w-full">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => removeUserOutTeam(user)}
                        >
                          <Trash /> Remove user
                        </DropdownMenuItem>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          This action will remove user {user.firstName}{" "}
                          {user.lastName} out of team {team.name}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
