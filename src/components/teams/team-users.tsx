"use client";

import { Ellipsis, Plus, Trash } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { Heading } from "@/components/heading";
import { TeamAvatar } from "@/components/shared/avatar-display";
import LoadingPlaceHolder from "@/components/shared/loading-place-holder"; // Import your spinner component
import AddUserToTeamDialog from "@/components/teams/team-add-user-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { useUserTeamRole } from "@/providers/user-team-role-provider";
import { PermissionUtils } from "@/types/resources";
import { TeamDTO } from "@/types/teams";
import { UserWithTeamRoleDTO } from "@/types/users";

const TeamUsersView = ({ entity: team }: ViewProps<TeamDTO>) => {
  const permissionLevel = usePagePermission();
  const teamRole = useUserTeamRole().role;
  const [open, setOpen] = useState(false);
  const [notDeleteOnlyManagerDialogOpen, setNotDeleteOnlyManagerDialogOpen] =
    useState(false);
  const [items, setItems] = useState<Array<UserWithTeamRoleDTO>>([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    findMembersByTeamId(team.id!)
      .then((data) => {
        setItems(data);
        setTotalMembers(data.length);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  async function removeUserOutTeam(user: UserWithTeamRoleDTO) {
    // Check if the user is the only Manager
    const isOnlyManager =
      user.teamRole === "Manager" &&
      items.filter((u) => u.teamRole === "Manager").length === 1;

    if (isOnlyManager) {
      setNotDeleteOnlyManagerDialogOpen(true);
      return;
    }

    await deleteUserFromTeam(team.id!, user.id!);
    await fetchUsers();
  }

  // Group users by role
  const groupedUsers = items.reduce<Record<string, UserWithTeamRoleDTO[]>>(
    (groups, user) => {
      const role = user.teamRole || "Unassigned";
      if (!groups[role]) {
        groups[role] = [];
      }
      groups[role].push(user);
      return groups;
    },
    {},
  );

  // Define the order of roles
  const roleOrder = ["Manager", "Member", "Guest", "Unassigned"];

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Tooltip>
            <TooltipTrigger>
              <TeamAvatar imageUrl={team.logoUrl} size="w-20 h-20" />
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-left">
                <p className="font-bold">{team.name}</p>
                <p className="text-sm text-gray-500">
                  {team.slogan ?? "Stronger Together"}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
          <Heading
            title={`Team Members (${totalMembers})`}
            description="Browse and manage the members of your team. View roles, contact information, and more"
          />
        </div>
        {(PermissionUtils.canWrite(permissionLevel) ||
          teamRole === "Manager") && (
          <div>
            <Button onClick={() => setOpen(true)}>
              <Plus /> Add User
            </Button>
            <AddUserToTeamDialog
              open={open}
              setOpen={setOpen}
              teamEntity={team}
              onSaveSuccess={() => fetchUsers()}
            />
          </div>
        )}
      </div>

      {loading ? (
        <LoadingPlaceHolder message="Load members ..." />
      ) : (
        roleOrder.map(
          (role) =>
            groupedUsers[role] && (
              <div key={role} className="mb-6">
                <h2 className="text-lg font-bold mb-4">{role}</h2>
                <div className="flex flex-row flex-wrap gap-4 content-around">
                  {groupedUsers[role].map((user) => (
                    <div
                      key={user.id}
                      className="w-[28rem] flex flex-row gap-4 border border-gray-200 px-4 py-4 rounded-2xl relative"
                    >
                      <div>
                        <Avatar className="size-24 cursor-pointer">
                          <AvatarImage
                            src={
                              user?.imageUrl
                                ? `/api/files/${user.imageUrl}`
                                : undefined
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
                          Email:{" "}
                          <Button variant="link" className="px-0 py-0 h-0">
                            <Link href={`mailto:${user.email}`}>
                              {user.email}
                            </Link>
                          </Button>
                        </div>
                        <div>Timezone: {user.timezone}</div>
                        <div>Title: {user.title}</div>
                      </div>
                      {(PermissionUtils.canWrite(permissionLevel) ||
                        teamRole === "Manager") && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Ellipsis className="cursor-pointer absolute top-2 right-2 text-gray-400" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-[14rem]">
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
                                    This action will remove user{" "}
                                    {user.firstName} {user.lastName} out of team{" "}
                                    {team.name}
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
              </div>
            ),
        )
      )}
      <AlertDialog open={notDeleteOnlyManagerDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Manager Role Required</AlertDialogTitle>
            <AlertDialogDescription>
              You cannot remove the only Manager from the team
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setNotDeleteOnlyManagerDialogOpen(false)}
            >
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TeamUsersView;
