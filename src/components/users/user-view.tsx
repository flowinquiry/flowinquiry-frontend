"use client";

import { formatDistanceToNow } from "date-fns";
import { Edit } from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { TeamAvatar, UserAvatar } from "@/components/shared/avatar-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { findTeamsByMemberId } from "@/lib/actions/teams.action";
import { findUserById, getDirectReports } from "@/lib/actions/users.action";
import { obfuscate } from "@/lib/endecode";
import { TeamDTO } from "@/types/teams";
import { UserType } from "@/types/users";

export const UserView = ({ userId }: { userId: number }) => {
  const [user, setUser] = useState<UserType | undefined | null>(undefined);
  const [teams, setTeams] = useState<TeamDTO[]>([]);
  const [directReports, setDirectReports] = useState<UserType[] | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await findUserById(userId);
        if (!userData) {
          notFound();
        }
        setUser(userData);

        const teamData = await findTeamsByMemberId(userId);
        setTeams(teamData);

        const reportData = await getDirectReports(userId);
        setDirectReports(reportData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userId, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner>Loading user data ...</Spinner>
      </div>
    );
  }

  if (!user) {
    notFound();
  }

  const breadcrumbItems = [
    { title: "Dashboard", link: "/portal" },
    { title: "Users", link: "/portal/users" },
    { title: `${user.firstName} ${user.lastName}`, link: "#" },
  ];

  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="flex flex-col md:flex-row items-start py-4 gap-4">
        {/* Left Panel */}
        <Card className="w-full md:w-[18rem]">
          <CardHeader className="flex flex-col items-center">
            <UserAvatar imageUrl={user.imageUrl} size="w-32 h-32" />
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div>
              <strong>Email:</strong>{" "}
              <Button variant="link" className="px-0 py-0 h-0">
                <Link href={`mailto: ${user.email}`}>{user.email}</Link>
              </Button>
            </div>
            <div>
              <strong>Title:</strong> {user.title}
            </div>
            <div>
              <strong>Last login time:</strong>{" "}
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
            <div>
              <strong>About:</strong> {user.about}
            </div>
          </CardContent>
        </Card>

        {/* Right Panel */}
        <Card className="w-full md:w-[56rem]">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xl">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-sm text-gray-500">{user.timezone}</div>
              </div>
              <Button
                onClick={() =>
                  router.push(`/portal/users/${obfuscate(user.id)}/edit`)
                }
              >
                <Edit />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 px-4 py-4 gap-4 text-sm">
              <div>
                <strong>About:</strong> {user.about}
              </div>
              <div>
                <strong>Address:</strong> {user.address}
              </div>
              <div>
                <strong>City:</strong> {user.city}
              </div>
              <div>
                <strong>State:</strong> {user.state}
              </div>
              <div>
                <strong>Country:</strong> {user.country}
              </div>
            </div>
            {user.managerId && (
              <div>
                <strong>Report to:</strong>{" "}
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
                <div>
                  <strong>Direct Reports:</strong>
                </div>
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
          </CardContent>
          <CardFooter>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <strong>Member of Teams:</strong>
              </div>
              <div className="flex flex-row flex-wrap gap-4">
                {(teams ?? []).map((team) => (
                  <Badge key={team.id} variant="outline" className="gap-2">
                    <TeamAvatar imageUrl={team.logoUrl} size="w-5 h-5" />
                    <Link href={`/portal/teams/${obfuscate(team.id)}`}>
                      {team.name}
                    </Link>
                  </Badge>
                ))}
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
