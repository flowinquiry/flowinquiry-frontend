"use client";

import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { TeamAvatar, UserAvatar } from "@/components/shared/avatar-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ViewProps } from "@/components/ui/ext-form";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { findTeamsByMemberId } from "@/lib/actions/teams.action";
import { getDirectReports } from "@/lib/actions/users.action";
import { obfuscate } from "@/lib/endecode";
import { TeamDTO } from "@/types/teams";
import { UserType } from "@/types/users";

export const UserView = ({ entity: user }: ViewProps<UserType>) => {
  const [teams, setTeams] = useState<TeamDTO[]>([]);
  const [directReports, setDirectReports] = useState<UserType[] | undefined>(
    undefined,
  );

  useEffect(() => {
    async function fetchTeams() {
      const data = await findTeamsByMemberId(user.id!);
      setTeams(data);
    }
    async function fetchDirectReports() {
      const data = await getDirectReports(user.id!);
      setDirectReports(data);
    }
    fetchTeams();
    fetchDirectReports();
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-start py-4 gap-4">
      <div className="grid grid-cols-1 w-full md:w-[18rem] space-x-4 space-y-4 justify-items-start rounded-lg border border-gray-300">
        <div className="flex justify-center w-full pt-4">
          <UserAvatar imageUrl={user.imageUrl} size="w-32 h-32" />
        </div>

        <div className="text-sm py-2 pr-2">
          <div>
            Email:{" "}
            <Button variant="link" className="px-0 py-0 h-0">
              <Link href={`mailto: ${user.email}`}>{user.email}</Link>
            </Button>
          </div>
          <div>Title: {user.title}</div>
          <div>
            Last login time:{" "}
            {user.lastLoginTime ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    {formatDistanceToNow(new Date(user.lastLoginTime), {
                      addSuffix: true,
                    })}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {new Date(user.lastLoginTime).toLocaleString()}
                </TooltipContent>
              </Tooltip>
            ) : (
              "No recent login"
            )}
          </div>
          <div>About: {user.about}</div>
        </div>
      </div>
      <div className="grid grid-cols-1 w-full md:w-[56rem] rounded-lg border border-gray-300 px-4 py-4">
        <div className="text-xl relative">
          <span>
            {user.firstName} {user.lastName}
          </span>
          <span className="text-sm absolute px-2 top-0">{user.timezone}</span>
        </div>
        <div className="grid grid-cols-1 px-4 py-4 gap-4 text-sm">
          <div>About: {user.about}</div>
          <div>Address: {user.address}</div>
          <div>City: {user.city}</div>
          <div>State: {user.state}</div>
          <div>Country: {user.country}</div>
        </div>
        {user.managerId && (
          <div>
            Report to:{" "}
            <Badge variant="outline" className="gap-2">
              <UserAvatar imageUrl={user.managerImageUrl} size="w-5 h-5" />
              <Link href={`/portal/users/${obfuscate(user.managerId)}`}>
                {user.managerName}
              </Link>
            </Badge>
          </div>
        )}
        {directReports && directReports.length > 0 && (
          <div className="py-4">
            <div>Direct Reports</div>
            <div className="flex flex-row flex-wrap gap-4 pt-4">
              {directReports.map((report) => (
                <Badge key={report.id} variant="outline" className="gap-2">
                  <UserAvatar imageUrl={report.imageUrl} size="w-5 h-5" />
                  <Link href={`/portal/users/${obfuscate(report.id)}`}>
                    {report.firstName} {report.lastName}
                  </Link>
                </Badge>
              ))}
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 gap-4">
          <div>Member of Teams</div>
          <div className="flex flex-row flex-wrap gap-4">
            {teams.map((team) => (
              <Badge key={team.id} variant="outline" className="gap-2">
                <TeamAvatar imageUrl={team.logoUrl} size="w-5 h-5" />
                <Link href={`/portal/teams/${obfuscate(team.id)}`}>
                  {team.name}
                </Link>
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
