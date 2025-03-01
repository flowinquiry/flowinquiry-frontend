"use client";

import { Ellipsis, Plus, Trash } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import useSWR from "swr";

import { Heading } from "@/components/heading";
import { TeamAvatar, UserAvatar } from "@/components/shared/avatar-display";
import LoadingPlaceHolder from "@/components/shared/loading-place-holder";
import AddUserToTeamDialog from "@/components/teams/team-add-user-dialog";
import TeamNavLayout from "@/components/teams/team-nav";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePagePermission } from "@/hooks/use-page-permission";
import {
  deleteUserFromTeam,
  findMembersByTeamId,
} from "@/lib/actions/teams.action";
import { obfuscate } from "@/lib/endecode";
import { BreadcrumbProvider } from "@/providers/breadcrumb-provider";
import { useError } from "@/providers/error-provider";
import { useTeam } from "@/providers/team-provider";
import { useUserTeamRole } from "@/providers/user-team-role-provider";
import { PermissionUtils } from "@/types/resources";
import { UserWithTeamRoleDTO } from "@/types/users";

const TeamUsersView = () => {
  const team = useTeam();
  const permissionLevel = usePagePermission();
  const teamRole = useUserTeamRole().role;
  const { setError } = useError();

  const [open, setOpen] = useState(false);
  const [notDeleteOnlyManagerDialogOpen, setNotDeleteOnlyManagerDialogOpen] =
    useState(false);

  // SWR fetcher
  const {
    data: items = [],
    error,
    isLoading,
    mutate,
  } = useSWR(team.id ? `/api/team/${team.id}/members` : null, async () =>
    findMembersByTeamId(team.id!, setError),
  );

  if (error) {
    return <p className="text-red-500">Failed to load team members.</p>;
  }

  const removeUserOutTeam = async (user: UserWithTeamRoleDTO) => {
    const isOnlyManager =
      user.teamRole === "Manager" &&
      items.filter((u) => u.teamRole === "Manager").length === 1;

    if (isOnlyManager) {
      setNotDeleteOnlyManagerDialogOpen(true);
      return;
    }

    await deleteUserFromTeam(team.id!, user.id!, setError);
    await mutate(); // Re-fetch the team members after deletion
  };

  // Group users by role
  const groupedUsers = items.reduce<Record<string, UserWithTeamRoleDTO[]>>(
    (groups, user) => {
      const role = user.teamRole || "Unassigned";
      if (!groups[role]) groups[role] = [];
      groups[role].push(user);
      return groups;
    },
    {},
  );

  // Define role order
  const roleOrder = ["Manager", "Member", "Guest", "Unassigned"];

  const breadcrumbItems = [
    { title: "Dashboard", link: "/portal" },
    { title: "Teams", link: "/portal/teams" },
    { title: team.name, link: `/portal/teams/${obfuscate(team.id)}` },
    { title: "Members", link: "#" },
  ];

  return (
    <BreadcrumbProvider items={breadcrumbItems}>
      <TeamNavLayout teamId={team.id!}>
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
                title={`Members (${items.length})`}
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
                  onSaveSuccess={() => mutate()} // Trigger SWR re-fetch
                />
              </div>
            )}
          </div>

          {isLoading ? (
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
                            <UserAvatar
                              imageUrl={user.imageUrl}
                              size="w-24 h-24"
                              className="cursor-pointer"
                            />
                          </div>
                          <div>
                            <div className="text-xl">
                              <Button variant="link" asChild className="px-0">
                                <Link
                                  href={`/portal/users/${obfuscate(user.id)}`}
                                >
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
                                    <DropdownMenuItem
                                      className="w-full flex items-center gap-2 cursor-pointer px-4 py-2"
                                      onClick={() => removeUserOutTeam(user)}
                                    >
                                      <TooltipTrigger className="w-full flex items-center gap-2">
                                        <Trash className="w-4 h-4 flex-shrink-0" />
                                        <span className="flex-1 text-left">
                                          Remove user
                                        </span>
                                      </TooltipTrigger>
                                    </DropdownMenuItem>
                                    <TooltipContent>
                                      <p>
                                        This action will remove user{" "}
                                        {user.firstName} {user.lastName} from
                                        team {team.name}
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
      </TeamNavLayout>
    </BreadcrumbProvider>
  );
};

export default TeamUsersView;
